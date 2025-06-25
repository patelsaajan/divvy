import type { TablesInsert } from "./database.types";

// ---- Supabase schemas ----

export type ReceiptSchema = TablesInsert<"receipts">;
export type ReceiptItemSchema = TablesInsert<"receipt_items">;
export type ReceiptItemAssignmentSchema =
  TablesInsert<"receipt_item_assignments">;

// ---- Form types ----

export type ReceiptItemAssignmentForm = Omit<
  ReceiptItemAssignmentSchema,
  "receipt_item_id" | "calculated_amount"
> & { id?: string };

export type ReceiptItemForm = {
  id: string;
  title: string;
  cost: number;
  assignments: ReceiptItemAssignmentForm[];
};

export type ReceiptEditForm = {
  items: ReceiptItemForm[];
};

// ---- Component types ----

export type ReceiptMember = {
  id: string;
  name: string;
  checked: boolean;
};

export type FieldItemsSwipe = {
  id: number;
  left: number;
  direction: string | null;
  lengthX: number;
  isSwiping: boolean;
};
