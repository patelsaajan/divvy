import * as mindee from "mindee";

const mindeeClient = new mindee.Client({
  apiKey: process.env.MINDEE_KEY,
});

export { mindee, mindeeClient };
