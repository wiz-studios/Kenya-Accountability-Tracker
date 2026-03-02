import type { SupabaseClient } from "@supabase/supabase-js"

const DEFAULT_SCHEMA = "public"

export const getSupabaseDataSchema = () => {
  const configured = (process.env.SUPABASE_DATA_SCHEMA || "").trim()
  return configured || DEFAULT_SCHEMA
}

export const fromDataSchema = (client: SupabaseClient, table: string) => {
  const schema = getSupabaseDataSchema()
  return schema === DEFAULT_SCHEMA ? client.from(table) : client.schema(schema).from(table)
}
