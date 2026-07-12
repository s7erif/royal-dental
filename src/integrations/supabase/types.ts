export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_advantages: {
        Row: {
          created_at: string
          display_order: number
          icon: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      about_content: {
        Row: {
          badge_subtitle: string
          badge_title: string
          bullets: Json
          created_at: string
          description: string
          eyebrow: string
          highlight: string
          id: string
          image_url: string | null
          singleton: boolean
          title: string
          updated_at: string
        }
        Insert: {
          badge_subtitle?: string
          badge_title?: string
          bullets?: Json
          created_at?: string
          description?: string
          eyebrow?: string
          highlight?: string
          id?: string
          image_url?: string | null
          singleton?: boolean
          title?: string
          updated_at?: string
        }
        Update: {
          badge_subtitle?: string
          badge_title?: string
          bullets?: Json
          created_at?: string
          description?: string
          eyebrow?: string
          highlight?: string
          id?: string
          image_url?: string | null
          singleton?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      about_timeline: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          title?: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      before_after_cases: {
        Row: {
          additional_images: Json
          after_image: string | null
          before_image: string | null
          category: string | null
          created_at: string
          description: string
          display_order: number
          id: string
          is_active: boolean
          is_featured: boolean
          patient_age: number | null
          patient_name: string | null
          sessions_count: number | null
          short_description: string | null
          title_ar: string | null
          title_en: string | null
          treatment_duration: string | null
          treatment_type: string | null
          updated_at: string
        }
        Insert: {
          additional_images?: Json
          after_image?: string | null
          before_image?: string | null
          category?: string | null
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          patient_age?: number | null
          patient_name?: string | null
          sessions_count?: number | null
          short_description?: string | null
          title_ar?: string | null
          title_en?: string | null
          treatment_duration?: string | null
          treatment_type?: string | null
          updated_at?: string
        }
        Update: {
          additional_images?: Json
          after_image?: string | null
          before_image?: string | null
          category?: string | null
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          patient_age?: number | null
          patient_name?: string | null
          sessions_count?: number | null
          short_description?: string | null
          title_ar?: string | null
          title_en?: string | null
          treatment_duration?: string | null
          treatment_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_content: {
        Row: {
          address: string
          created_at: string
          email: string
          facebook_url: string
          google_maps_embed_url: string
          id: string
          instagram_url: string
          offers_section_enabled: boolean
          phones: Json
          singleton: boolean
          snapchat_url: string
          tiktok_url: string
          updated_at: string
          whatsapp: string
          working_hours: string
          youtube_url: string
        }
        Insert: {
          address?: string
          created_at?: string
          email?: string
          facebook_url?: string
          google_maps_embed_url?: string
          id?: string
          instagram_url?: string
          offers_section_enabled?: boolean
          phones?: Json
          singleton?: boolean
          snapchat_url?: string
          tiktok_url?: string
          updated_at?: string
          whatsapp?: string
          working_hours?: string
          youtube_url?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          facebook_url?: string
          google_maps_embed_url?: string
          id?: string
          instagram_url?: string
          offers_section_enabled?: boolean
          phones?: Json
          singleton?: boolean
          snapchat_url?: string
          tiktok_url?: string
          updated_at?: string
          whatsapp?: string
          working_hours?: string
          youtube_url?: string
        }
        Relationships: []
      }
      doctor_content: {
        Row: {
          created_at: string
          description: string
          eyebrow: string
          id: string
          image_url: string | null
          job_title: string
          name: string
          singleton: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          eyebrow?: string
          id?: string
          image_url?: string | null
          job_title?: string
          name?: string
          singleton?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          eyebrow?: string
          id?: string
          image_url?: string | null
          job_title?: string
          name?: string
          singleton?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      doctor_stats: {
        Row: {
          created_at: string
          display_order: number
          icon: string
          id: string
          title: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          title: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          title?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          certifications: Json
          created_at: string
          description: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          job_title: string
          name: string
          patients_count: number
          specialties: Json
          updated_at: string
          years_experience: number
        }
        Insert: {
          certifications?: Json
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          job_title?: string
          name: string
          patients_count?: number
          specialties?: Json
          updated_at?: string
          years_experience?: number
        }
        Update: {
          certifications?: Json
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          job_title?: string
          name?: string
          patients_count?: number
          specialties?: Json
          updated_at?: string
          years_experience?: number
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          category_id: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title_ar: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_content: {
        Row: {
          badge_text: string
          created_at: string
          floating_items: Json
          id: string
          image_caption_eyebrow: string
          image_caption_title: string
          image_url: string | null
          primary_cta_label: string
          primary_cta_url: string
          secondary_cta_label: string
          secondary_cta_url: string
          singleton: boolean
          subtitle: string
          title_highlight: string
          title_line1: string
          updated_at: string
        }
        Insert: {
          badge_text?: string
          created_at?: string
          floating_items?: Json
          id?: string
          image_caption_eyebrow?: string
          image_caption_title?: string
          image_url?: string | null
          primary_cta_label?: string
          primary_cta_url?: string
          secondary_cta_label?: string
          secondary_cta_url?: string
          singleton?: boolean
          subtitle?: string
          title_highlight?: string
          title_line1?: string
          updated_at?: string
        }
        Update: {
          badge_text?: string
          created_at?: string
          floating_items?: Json
          id?: string
          image_caption_eyebrow?: string
          image_caption_title?: string
          image_url?: string | null
          primary_cta_label?: string
          primary_cta_url?: string
          secondary_cta_label?: string
          secondary_cta_url?: string
          singleton?: boolean
          subtitle?: string
          title_highlight?: string
          title_line1?: string
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          badge: string
          button_text: string
          button_url: string
          created_at: string
          description: string
          discount: string
          display_order: number
          end_date: string | null
          icon: string
          id: string
          image_url: string | null
          is_active: boolean
          new_price: string
          old_price: string
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string
          button_text?: string
          button_url?: string
          created_at?: string
          description?: string
          discount?: string
          display_order?: number
          end_date?: string | null
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          new_price?: string
          old_price?: string
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          badge?: string
          button_text?: string
          button_url?: string
          created_at?: string
          description?: string
          discount?: string
          display_order?: number
          end_date?: string | null
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          new_price?: string
          old_price?: string
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name_ar: string
          name_en: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name_ar: string
          name_en?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name_ar?: string
          name_en?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_variants: {
        Row: {
          created_at: string
          description_ar: string | null
          display_order: number
          fixed_price: number | null
          id: string
          is_active: boolean
          max_price: number | null
          min_price: number | null
          name_ar: string
          pricing_type: Database["public"]["Enums"]["service_pricing_type"]
          service_id: string
          starting_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          display_order?: number
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          max_price?: number | null
          min_price?: number | null
          name_ar: string
          pricing_type?: Database["public"]["Enums"]["service_pricing_type"]
          service_id: string
          starting_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          display_order?: number
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          max_price?: number | null
          min_price?: number | null
          name_ar?: string
          pricing_type?: Database["public"]["Enums"]["service_pricing_type"]
          service_id?: string
          starting_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_variants_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          button_text: string | null
          button_url: string | null
          category_id: string | null
          cover_image: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          display_order: number
          duration: string | null
          featured: boolean
          features: Json
          fixed_price: number | null
          gallery_images: Json
          icon: string
          id: string
          max_price: number | null
          meta_description: string | null
          meta_title: string | null
          min_price: number | null
          name_ar: string
          name_en: string | null
          price: string | null
          pricing_type: Database["public"]["Enums"]["service_pricing_type"]
          seo_keywords: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          short_desc_ar: string | null
          short_desc_en: string | null
          show_on_homepage: boolean
          slug: string | null
          starting_price: number | null
          status: Database["public"]["Enums"]["service_status"]
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          duration?: string | null
          featured?: boolean
          features?: Json
          fixed_price?: number | null
          gallery_images?: Json
          icon?: string
          id?: string
          max_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_price?: number | null
          name_ar: string
          name_en?: string | null
          price?: string | null
          pricing_type?: Database["public"]["Enums"]["service_pricing_type"]
          seo_keywords?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          short_desc_ar?: string | null
          short_desc_en?: string | null
          show_on_homepage?: boolean
          slug?: string | null
          starting_price?: number | null
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          duration?: string | null
          featured?: boolean
          features?: Json
          fixed_price?: number | null
          gallery_images?: Json
          icon?: string
          id?: string
          max_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_price?: number | null
          name_ar?: string
          name_en?: string | null
          price?: string | null
          pricing_type?: Database["public"]["Enums"]["service_pricing_type"]
          seo_keywords?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          short_desc_ar?: string | null
          short_desc_en?: string | null
          show_on_homepage?: boolean
          slug?: string | null
          starting_price?: number | null
          status?: Database["public"]["Enums"]["service_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          open_in_new_tab: boolean
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          open_in_new_tab?: boolean
          platform: string
          updated_at?: string
          url?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          open_in_new_tab?: boolean
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          date_label: string
          display_order: number
          id: string
          is_active: boolean
          patient_image: string | null
          patient_name: string
          rating: number
          review: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_label?: string
          display_order?: number
          id?: string
          is_active?: boolean
          patient_image?: string | null
          patient_name: string
          rating?: number
          review: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_label?: string
          display_order?: number
          id?: string
          is_active?: boolean
          patient_image?: string | null
          patient_name?: string
          rating?: number
          review?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials_summary: {
        Row: {
          created_at: string
          google_button_url: string
          google_rating: number
          google_reviews_count: number
          id: string
          singleton: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          google_button_url?: string
          google_rating?: number
          google_reviews_count?: number
          id?: string
          singleton?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          google_button_url?: string
          google_rating?: number
          google_reviews_count?: number
          id?: string
          singleton?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_count: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
      service_pricing_type: "fixed" | "range" | "starting_from" | "consultation"
      service_status: "active" | "hidden" | "draft"
      service_type: "simple" | "grouped"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
      service_pricing_type: ["fixed", "range", "starting_from", "consultation"],
      service_status: ["active", "hidden", "draft"],
      service_type: ["simple", "grouped"],
    },
  },
} as const
