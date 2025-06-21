import { v4 as uuid } from "uuid";
import { ReceiptItemSchema, ReceiptSchema } from "~~/types/receipts";
import { supabase } from "~~/utils/supabase";

import mockResponse from "~~/mock/receipt4-tesco.json";

const getFileExtension = (fileName: string) => {
  return (
    fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
    fileName
  );
};

function parseMindeeResponse(
  mindeeResponse: MindeeResponse,
  receiptId: string,
  storagePath: string
): {
  receipt: ReceiptSchema;
  items: ReceiptItemSchema[];
} {
  const { prediction } = mindeeResponse.document.inference;

  // Parse receipt data
  const receipt: ReceiptSchema = {
    id: receiptId,
    storage_path: storagePath,
    total_cost: prediction.totalAmount.value || null,
    currency: prediction.locale.currency || null,
    raw_json: mindeeResponse,
    title: null,
    emoji: null,
    vendor: prediction.supplierName.value || null,
    country_code: prediction.locale.country || null,
  };

  // Parse line items
  const items: ReceiptItemSchema[] =
    prediction.lineItems?.map((item, index) => ({
      receipt_id: receiptId,
      title: item.description || `Item ${index + 1}`,
      cost: item.totalAmount || null,
    })) ?? [];

  return { receipt, items };
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  const file = formData?.find((item) => item.name === "image") as
    | File
    | undefined;

  if (!file) {
    return createError({
      statusCode: 400,
      statusMessage: "No image file found",
    });
  }

  // Upload the file to supabase storage
  const receiptId = uuid();
  const fileName = `${receiptId}.${getFileExtension(file.name)}`;
  const filePath = `${fileName}`; // Change this to `${userId}/${receiptId}` when auth is setup and update bucket policy

  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(filePath, file, {
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

  // Commented out during development to not waste mindee credits (250 per month)
  // TODO: Uncomment this once product is live
  // Using the signed URL, called mindee api to process the receipt
  // const inputSource = mindeeClient.docFromUrl(data.signedUrl);
  // const apiResponse = await mindeeClient.parse(
  //   mindee.product.ReceiptV5,
  //   inputSource
  // );

  // return {id: receiptId, data: apiResponse.document}

  // Parse the response from mindee
  const { receipt, items } = parseMindeeResponse(
    { document: mockResponse } as unknown as MindeeResponse,
    receiptId,
    filePath
  );

  // Upload the parsed response to Supabase
  const { error: insertError } = await supabase
    .from("receipts")
    .insert(receipt);
  const { error: insertItemsError } = await supabase
    .from("receipt_items")
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

  return { id: receiptId, data: { receipt, items } };
});
