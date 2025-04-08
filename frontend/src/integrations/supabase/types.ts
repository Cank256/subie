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
      billing: {
        Row: {
          amount: number
          currency: string
          id: string
          invoice_url: string | null
          payment_date: string
          payment_method: string | null
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          currency?: string
          id?: string
          invoice_url?: string | null
          payment_date?: string
          payment_method?: string | null
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          currency?: string
          id?: string
          invoice_url?: string | null
          payment_date?: string
          payment_method?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_text: string | null
          action_url: string | null
          created_at: string
          description: string
          id: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string
          description: string
          id?: string
          read?: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string
          description?: string
          id?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          currency: string | null
          email: string
          first_name: string | null
          id: string
          is_admin: boolean
          language: string | null
          last_name: string | null
          phone: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          currency?: string | null
          email: string
          first_name?: string | null
          id: string
          is_admin?: boolean
          language?: string | null
          last_name?: string | null
          phone?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          currency?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean
          language?: string | null
          last_name?: string | null
          phone?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          active: boolean
          amount: number
          auto_renew: boolean
          billing_cycle: string
          category: string
          color: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          logo: string | null
          name: string
          next_billing_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          amount: number
          auto_renew?: boolean
          billing_cycle: string
          category: string
          color?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          logo?: string | null
          name: string
          next_billing_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          amount?: number
          auto_renew?: boolean
          billing_cycle?: string
          category?: string
          color?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
          next_billing_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_login_sessions: {
        Row: {
          created_at: string | null
          device_name: string
          device_type: string
          id: string
          ip_address: string | null
          is_current: boolean | null
          last_active: string | null
          location: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_name: string
          device_type: string
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active?: string | null
          location?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_name?: string
          device_type?: string
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active?: string | null
          location?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          currency: string
          default_view: string
          email_notifications: boolean
          id: string
          push_notifications: boolean
          reminders_before: number
          show_inactive_subscriptions: boolean
          theme: string
          time_format: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          default_view?: string
          email_notifications?: boolean
          id?: string
          push_notifications?: boolean
          reminders_before?: number
          show_inactive_subscriptions?: boolean
          theme?: string
          time_format?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          default_view?: string
          email_notifications?: boolean
          id?: string
          push_notifications?: boolean
          reminders_before?: number
          show_inactive_subscriptions?: boolean
          theme?: string
          time_format?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          billing_updates: boolean | null
          email_notifications: boolean
          language: string
          new_features: boolean | null
          newsletter: boolean | null
          push_notifications: boolean
          reminder_days: number | null
          sms_notifications: boolean
          theme: string
          tips: boolean | null
          user_id: string
        }
        Insert: {
          billing_updates?: boolean | null
          email_notifications?: boolean
          language?: string
          new_features?: boolean | null
          newsletter?: boolean | null
          push_notifications?: boolean
          reminder_days?: number | null
          sms_notifications?: boolean
          theme?: string
          tips?: boolean | null
          user_id: string
        }
        Update: {
          billing_updates?: boolean | null
          email_notifications?: boolean
          language?: string
          new_features?: boolean | null
          newsletter?: boolean | null
          push_notifications?: boolean
          reminder_days?: number | null
          sms_notifications?: boolean
          theme?: string
          tips?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_profile_owner: {
        Args: {
          profile_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      notification_type:
        | "payment"
        | "reminder"
        | "renewal"
        | "price_change"
        | "system"
      subscription_tier: "free" | "basic" | "premium" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
