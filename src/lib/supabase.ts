import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isValidSupabaseConfig =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl !== 'https://your-project-ref.supabase.co' &&
  supabaseAnonKey !== 'your-supabase-anon-key' &&
  supabaseUrl!.startsWith('http');

export const supabase: SupabaseClient | null = isValidSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const isSupabaseConnected = isValidSupabaseConfig;

/**
 * Helper to upsert a key-value document into the `tgg_app_state` table on Supabase
 * when Supabase is connected, silently falling back to local persistence otherwise.
 */
export async function syncStateToSupabase(key: string, payload: unknown): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('tgg_app_state').upsert(
      {
        id: key,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch {
    // Keep local state resilient if table is not yet created
  }
}

export async function fetchAllStateFromSupabase(): Promise<Record<string, unknown> | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('tgg_app_state').select('id, payload');
    if (error || !data) return null;
    const map: Record<string, unknown> = {};
    for (const row of data) {
      map[row.id] = row.payload;
    }
    return map;
  } catch {
    return null;
  }
}

export const SUPABASE_SQL_SCHEMA = `-- The Gift Gallery (TGG x MetaWave Innovations LTD) Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor to initialize all tables and RLS policies

CREATE TABLE IF NOT EXISTS public.tgg_app_state (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tgg_orders (
  id TEXT PRIMARY KEY,
  user_email TEXT,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  city TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  gift_type TEXT NOT NULL,
  selected_product_name TEXT,
  selected_product_tier TEXT,
  amount_pkr INTEGER NOT NULL DEFAULT 0,
  payment_method_type TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  order_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tgg_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_display TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  product_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tgg_app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of app state" ON public.tgg_app_state FOR SELECT USING (true);
CREATE POLICY "Allow authenticated/anon upsert of app state" ON public.tgg_app_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read of products" ON public.tgg_products FOR SELECT USING (true);
CREATE POLICY "Allow orders insert and read" ON public.tgg_orders FOR ALL USING (true) WITH CHECK (true);
`;
