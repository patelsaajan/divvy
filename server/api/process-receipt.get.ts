import { mindee, mindeeClient } from "~/utils/mindee";
import { supabase } from "~/utils/supabase";

export default defineEventHandler(async (event) => {
  //   const formData = await readMultipartFormData(event);

  //   const file = formData?.find((item) => item.name === "image") as
  //     | File
  //     | undefined;

  //   if (!file) {
  //     return createError({
  //       statusCode: 400,
  //       statusMessage: "No image file found",
  //     });
  //   }

  // Create a signed URL
  const { data, error } = await supabase.storage
    .from("receipts")
    .createSignedUrl("receipt1.jpeg", 3600);

  if (!data?.signedUrl || error) {
    return createError({
      statusCode: 500,
      statusMessage: "Failed to process receipt",
    });
  }

  // Using the signed URL, called mindee api to process the receipt
  const inputSource = mindeeClient.docFromUrl(data.signedUrl);
  const apiResponse = mindeeClient.parse(mindee.product.ReceiptV5, inputSource);

  // Handle the response Promise
  apiResponse.then((resp) => {
    // print a string summary
    console.log(resp.document.toString());
  });

  return apiResponse;
});
