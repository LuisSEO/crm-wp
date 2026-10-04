// Tipos de la base de datos, generados desde Supabase (versión recortada: solo las tablas).
// Si cambia el modelo de datos, vuelve a generarlos.

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      etiquetas: {
        Row: { color: string; id: string; nombre: string };
        Insert: { color?: string; id?: string; nombre: string };
        Update: { color?: string; id?: string; nombre?: string };
        Relationships: [];
      };
      lead_etiquetas: {
        Row: { etiqueta_id: string; lead_id: string };
        Insert: { etiqueta_id: string; lead_id: string };
        Update: { etiqueta_id?: string; lead_id?: string };
        Relationships: [
          {
            foreignKeyName: "lead_etiquetas_etiqueta_id_fkey";
            columns: ["etiqueta_id"];
            isOneToOne: false;
            referencedRelation: "etiquetas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lead_etiquetas_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          created_at: string;
          email: string | null;
          empresa: string | null;
          estado: string;
          id: string;
          nombre: string;
          origen: string | null;
          telefono: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          empresa?: string | null;
          estado?: string;
          id?: string;
          nombre: string;
          origen?: string | null;
          telefono?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          empresa?: string | null;
          estado?: string;
          id?: string;
          nombre?: string;
          origen?: string | null;
          telefono?: string | null;
        };
        Relationships: [];
      };
      notas: {
        Row: { created_at: string; id: string; lead_id: string; texto: string };
        Insert: { created_at?: string; id?: string; lead_id: string; texto: string };
        Update: { created_at?: string; id?: string; lead_id?: string; texto?: string };
        Relationships: [
          {
            foreignKeyName: "notas_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      oportunidades: {
        Row: {
          cierre_estimado: string | null;
          created_at: string;
          fase: string;
          id: string;
          lead_id: string;
          titulo: string;
          valor: number;
        };
        Insert: {
          cierre_estimado?: string | null;
          created_at?: string;
          fase?: string;
          id?: string;
          lead_id: string;
          titulo: string;
          valor?: number;
        };
        Update: {
          cierre_estimado?: string | null;
          created_at?: string;
          fase?: string;
          id?: string;
          lead_id?: string;
          titulo?: string;
          valor?: number;
        };
        Relationships: [
          {
            foreignKeyName: "oportunidades_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
