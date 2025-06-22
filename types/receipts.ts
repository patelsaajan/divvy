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
  locale: string | null;
  uploaded_at: string;
};

export type ReceiptItemSchema = {
  receipt_id: string;
  title: string | null;
  cost: number | null;
};

export type ReceiptItemAssignmentSchema = {
  id: string;
  receipt_item_id: string;
  user_name: string;
  method: "equal" | "percent" | "amount";
  value: number | null;
  calculated_amount: number | null;
};

// ---- Form types ----

export type ReceiptItemAssignmentForm = Omit<
  ReceiptItemAssignmentSchema,
  "receipt_item_id" | "calculated_amount"
> & { id?: string };

export type ReceiptItemForm = {
  id?: string | number;
  title: string;
  cost: number;
  assignments: ReceiptItemAssignmentForm[];
};

export type ReceiptEditForm = {
  items: ReceiptItemForm[];
};

// ---- Component types ----

export type ReceiptMember = {
  id: number;
  name: string;
  amount: number;
  checked: boolean;
};

export type fieldItemsSwipe = {
  id: number;
  left: number;
  direction: string | null;
  lengthX: number;
  isSwiping: boolean;
};
