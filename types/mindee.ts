// Types for Mindee API response
interface MindeeLineItem {
  confidence: number;
  polygon: number[][];
  description: string;
  quantity: number | null;
  totalAmount: number;
  unitPrice: number | null;
  pageId: number;
}

interface MindeeReceipt {
  lineItems: MindeeLineItem[];
  supplierName: {
    value: string;
    confidence: number;
  };
  totalAmount: {
    value: number;
    confidence: number;
  };
  date: {
    value: string;
    confidence: number;
  };
  time: {
    value: string;
    confidence: number;
  };
  category: {
    value: string;
    confidence: number;
  };
  subcategory: {
    value: string;
    confidence: number;
  };
  taxes: Array<{
    value: number;
    confidence: number;
    code: string;
  }>;
  tip: {
    value?: number;
    confidence: number;
  };
  locale: {
    value: string;
    currency: string;
    confidence: number;
    country: string;
  };
  receiptNumber: {
    value: string;
    confidence: number;
  };
  documentType: {
    value: string;
    confidence: number;
  };
}

interface MindeeResponse {
  document: {
    inference: {
      prediction: MindeeReceipt;
      confidence: number;
    };
  };
}
