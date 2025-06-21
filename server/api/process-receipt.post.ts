import { v4 as uuid } from "uuid";
import { supabase } from "~/utils/supabase";

const getFileExtension = (fileName: string) => {
  return (
    fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
    fileName
  );
};

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
  const receiptId = `${uuid()}.${getFileExtension(file.name)}`;
  const filePath = `${receiptId}`; // Change this to `${userId}/${receiptId}` when auth is setup and update bucket policy

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

  return data;
});
