export type ReceiptSchema = {
  id: string;
  storage_path: string;
  total_cost: number | null;
  currency: string | null;
  raw_json?: Record<string, any>;
  title: string | null;
  emoji: string | null;
  vendor: string | null;
  country_code: string | null;
};

export type ReceiptItemSchema = {
  receipt_id: string;
  title: string | null;
  cost: number | null;
};
