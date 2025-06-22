export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          display_name: string | null
          id: string
        }
        Insert: {
          display_name?: string | null
          id: string
        }
        Update: {
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      receipt_item_assignments: {
        Row: {
          calculated_amount: number | null
          created_at: string | null
          denominator: number | null
          id: string
          method: string
          numerator: number | null
          receipt_item_id: string | null
          user_name: string
          value: number | null
        }
        Insert: {
          calculated_amount?: number | null
          created_at?: string | null
          denominator?: number | null
          id?: string
          method: string
          numerator?: number | null
          receipt_item_id?: string | null
          user_name: string
          value?: number | null
        }
        Update: {
          calculated_amount?: number | null
          created_at?: string | null
          denominator?: number | null
          id?: string
          method?: string
          numerator?: number | null
          receipt_item_id?: string | null
          user_name?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_item_assignments_receipt_item_id_fkey"
            columns: ["receipt_item_id"]
            isOneToOne: false
            referencedRelation: "receipt_items"
            referencedColumns: ["id"]
          },
        ]
      }
      receipt_items: {
        Row: {
          cost: number | null
          id: string
          receipt_id: string | null
          title: string | null
        }
        Insert: {
          cost?: number | null
          id?: string
          receipt_id?: string | null
          title?: string | null
        }
        Update: {
          cost?: number | null
          id?: string
          receipt_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          country_code: string | null
          currency: string | null
          emoji: string | null
          id: string
          locale: string | null
          raw_json: Json | null
          storage_path: string | null
          title: string | null
          total_cost: number | null
          uploaded_at: string | null
          user_id: string | null
          vendor: string | null
        }
        Insert: {
          country_code?: string | null
          currency?: string | null
          emoji?: string | null
          id?: string
          locale?: string | null
          raw_json?: Json | null
          storage_path?: string | null
          title?: string | null
          total_cost?: number | null
          uploaded_at?: string | null
          user_id?: string | null
          vendor?: string | null
        }
        Update: {
          country_code?: string | null
          currency?: string | null
          emoji?: string | null
          id?: string
          locale?: string | null
          raw_json?: Json | null
          storage_path?: string | null
          title?: string | null
          total_cost?: number | null
          uploaded_at?: string | null
          user_id?: string | null
          vendor?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
