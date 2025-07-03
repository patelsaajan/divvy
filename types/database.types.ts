export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          display_name: string;
          id: string;
        };
        Insert: {
          display_name: string;
          id: string;
        };
        Update: {
          display_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      receipt_item_assignments: {
        Row: {
          calculated_amount: number;
          created_at: string;
          id: string;
          method: string;
          receipt_item_id: string;
          user_name: string;
          value: number;
        };
        Insert: {
          calculated_amount: number;
          created_at?: string;
          id?: string;
          method: string;
          receipt_item_id: string;
          user_name: string;
          value: number;
        };
        Update: {
          calculated_amount?: number;
          created_at?: string;
          id?: string;
          method?: string;
          receipt_item_id?: string;
          user_name?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "receipt_item_assignments_receipt_item_id_fkey";
            columns: ["receipt_item_id"];
            isOneToOne: false;
            referencedRelation: "receipt_items";
            referencedColumns: ["id"];
          }
        ];
      };
      receipt_items: {
        Row: {
          cost: number;
          created_at: string;
          id: string;
          receipt_id: string;
          title: string;
        };
        Insert: {
          cost: number;
          created_at?: string;
          id?: string;
          receipt_id: string;
          title: string;
        };
        Update: {
          cost?: number;
          created_at?: string;
          id?: string;
          receipt_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "receipt_items_receipt_id_fkey";
            columns: ["receipt_id"];
            isOneToOne: false;
            referencedRelation: "receipts";
            referencedColumns: ["id"];
          }
        ];
      };
      receipts: {
        Row: {
          country_code: string;
          currency: string;
          emoji: string | null;
          id: string;
          locale: string | null;
          raw_json: Json;
          storage_path: string;
          title: string | null;
          total_cost: number;
          uploaded_at: string;
          user_id: string;
          vendor: string | null;
        };
        Insert: {
          country_code: string;
          currency: string;
          emoji?: string | null;
          id?: string;
          locale?: string | null;
          raw_json: Json;
          storage_path: string;
          title?: string | null;
          total_cost: number;
          uploaded_at?: string;
          user_id: string;
          vendor?: string | null;
        };
        Update: {
          country_code?: string;
          currency?: string;
          emoji?: string | null;
          id?: string;
          locale?: string | null;
          raw_json?: Json;
          storage_path?: string;
          title?: string | null;
          total_cost?: number;
          uploaded_at?: string;
          user_id?: string;
          vendor?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_members_totals: {
        Args: {
          receipt_id_input: string;
        };
        Returns: {
          user_name: string;
          assignments: {
            title: string;
            cost: number;
            user_name: string;
            method: string;
            value: number;
            calculated_amount: number;
          }[];
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
