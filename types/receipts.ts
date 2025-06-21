// ---- Supabase schemas ----

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

export type ReceiptItemAssignmentSchema = {
  receipt_item_id: string;
  user_name: string;
  method: "equal" | "share" | "amount";
  numerator: number;
  denominator: number;
  value: number;
  calculated_amount: number;
};

// ---- Form types ----

export type ReceiptItemAssignmentForm = Omit<
  ReceiptItemAssignmentSchema,
  "receipt_item_id" | "calculated_amount"
>;

export type ReceiptItemForm = {
  title: string;
  cost: number;
  assignments: ReceiptItemAssignmentForm[];
};

export type ReceiptEditForm = {
  items: ReceiptItemForm[];
};
