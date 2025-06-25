import { serverSupabaseClient } from "#supabase/server";
import { v4 as uuid } from "uuid";
import { Database, Json } from "~~/types/database.types";
import { ReceiptItemSchema, ReceiptSchema } from "~~/types/receipts";
import { mindee, mindeeClient } from "~~/utils/mindee";
import { tables } from "~~/utils/tables";

const getFileExtension = (fileName: string) => {
  return (
    fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
    fileName
  );
};

function parseMindeeResponse(
  mindeeResponse: MindeeResponse,
  receiptId: string,
  storagePath: string,
  userId: string
) {
  const { prediction } = mindeeResponse.document.inference;

  // Parse receipt data
  const receipt: ReceiptSchema = {
    id: receiptId,
    storage_path: storagePath,
    total_cost: prediction.totalAmount.value ?? 0,
    currency: prediction.locale.currency ?? "GBP",
    raw_json: mindeeResponse as unknown as Json,
    title: null,
    emoji: null,
    vendor: prediction.supplierName.value ?? null,
    country_code: prediction.locale.country ?? "GB",
    locale: prediction.locale.value ?? "en-GB",
    user_id: userId,
  };

  const items: ReceiptItemSchema[] =
    prediction.lineItems?.map((item, index) => ({
      receipt_id: receiptId,
      title: item.description || `Item ${index + 1}`,
      cost: item.totalAmount ?? 0,
    })) ?? [];

  return { receipt, items };
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  const supabase = await serverSupabaseClient<Database>(event);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const file = formData?.find((item) => item.type === "image/jpeg");
  if (!file) {
    return createError({
      statusCode: 400,
      statusMessage: "No image file found",
    });
  }

  if (!user) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Upload the file to supabase storage
  const receiptId = uuid();
  const fileName = `${receiptId}.${getFileExtension(file.filename ?? "jpg")}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(filePath, file.data, {
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    return createError({
      statusCode: 500,
      statusMessage: "Failed to upload receipt",
    });
  }

  // Create a signed URL
  const { data, error: signedUrlError } = await supabase.storage
    .from("receipts")
    .createSignedUrl(filePath, 3600);

  if (!data?.signedUrl || signedUrlError) {
    return createError({
      statusCode: 500,
      statusMessage: "Failed to process receipt",
    });
  }

  // Using the signed URL, called mindee api to process the receipt
  const inputSource = mindeeClient.docFromUrl(data.signedUrl);
  const apiResponse = await mindeeClient.parse(
    mindee.product.ReceiptV5,
    inputSource
  );

  // Parse the response from mindee
  const { receipt, items } = parseMindeeResponse(
    { document: apiResponse.document } as unknown as MindeeResponse,
    receiptId,
    filePath,
    user.id
  );

  // Upload the parsed response to Supabase
  const { error: insertError } = await supabase
    .from(tables.receipts)
    .insert(receipt);
  const { error: insertItemsError } = await supabase
    .from(tables.receiptItems)
    .insert(items);

  if (insertError) {
    return createError({
      statusCode: 500,
      statusMessage: `Error uploading receipt: ${insertError.message}`,
    });
  }

  if (insertItemsError) {
    return createError({
      statusCode: 500,
      statusMessage: `Error uploading receipt items: ${insertItemsError.message}`,
    });
  }

  return { id: receiptId };
});
