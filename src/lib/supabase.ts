import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createBrowserSupabaseClient } from '../../utils/supabase/client';
import {
  PortalOrder,
  Product,
  Category,
  Occasion,
  PolicyItem,
  SiteSettings,
  FormCustomizeOptions,
  UserProfile,
  SavedRecipient,
  SeoPageMetadata,
  SocialPageOrPost,
  KnowledgeBaseEntry,
  ContactDirectoryEntry,
  FormSubmissionRecord,
} from '../types';

export const SUPABASE_PROJECT_REF = 'lxgrmvkabytnxtdhdurc';

export const SUPABASE_PROJECT_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  'https://lxgrmvkabytnxtdhdurc.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_3p_3TAH6Z47IACLsWNO3pQ_YFsw_m7b';

export const SUPABASE_SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`;

const isValidSupabaseConfig =
  Boolean(SUPABASE_PROJECT_URL) &&
  Boolean(SUPABASE_PUBLISHABLE_KEY) &&
  SUPABASE_PROJECT_URL !== 'https://your-project-ref.supabase.co' &&
  SUPABASE_PUBLISHABLE_KEY !== 'your-supabase-anon-key' &&
  SUPABASE_PROJECT_URL.startsWith('http');

export const supabase: SupabaseClient | null = isValidSupabaseConfig
  ? (createBrowserSupabaseClient() as unknown as SupabaseClient)
  : null;

export const isSupabaseConnected = isValidSupabaseConfig;

export interface FullDatabaseSnapshot {
  orders: PortalOrder[];
  products: Product[];
  categories: Category[];
  occasions: Occasion[];
  policies: PolicyItem[];
  siteSettings: SiteSettings;
  formOptions: FormCustomizeOptions;
  userProfile: UserProfile;
  savedRecipients: SavedRecipient[];
  wishlistIds: string[];
  seoMetadata: SeoPageMetadata[];
  socialPages: SocialPageOrPost[];
  knowledgeBase: KnowledgeBaseEntry[];
  contacts: ContactDirectoryEntry[];
  formSubmissions: FormSubmissionRecord[];
}

export interface SupabaseSyncResult {
  status: 'synced' | 'schema_required' | 'error';
  tablesReady: boolean;
  recordsPushed: number;
  tablesSynced: string[];
  missingTables: string[];
  lastSyncedAt: string;
  message: string;
}

/**
 * Escapes a JavaScript value into a safe PostgreSQL literal for dynamic SQL seed generation
 */
function sqlLiteral(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return Number.isFinite(val) ? String(val) : '0';
  if (typeof val === 'object') {
    const jsonStr = JSON.stringify(val).replace(/'/g, "''");
    return `'${jsonStr}'::jsonb`;
  }
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

export const SUPABASE_SQL_SCHEMA = `-- ============================================================================
-- The Gift Gallery (TGG x MetaWave Innovations LTD) Complete PostgreSQL Schema
-- Project: https://lxgrmvkabytnxtdhdurc.supabase.co
-- Creates all 13 relational tables, connections, indexes, RLS policies, and RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- 1. Master Application State & CMS Store
CREATE TABLE IF NOT EXISTS public.tgg_app_state (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Gift Categories / Collections
CREATE TABLE IF NOT EXISTS public.tgg_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Gift Products Catalog (connected to tgg_categories via category)
CREATE TABLE IF NOT EXISTS public.tgg_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  image TEXT,
  price_display TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  product_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Gift Occasions
CREATE TABLE IF NOT EXISTS public.tgg_occasions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  icon_name TEXT NOT NULL,
  occasion_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contacts Directory (Brand, Banks, Tech Partner, Customers & Recipients)
CREATE TABLE IF NOT EXISTS public.tgg_contacts (
  id TEXT PRIMARY KEY,
  contact_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  instagram_handle TEXT,
  city TEXT,
  address TEXT,
  role_or_relationship TEXT,
  notes TEXT,
  linked_order_id TEXT,
  contact_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Customer Gift Bookings & Orders (connected to tgg_products & tgg_contacts)
CREATE TABLE IF NOT EXISTS public.tgg_orders (
  id TEXT PRIMARY KEY,
  user_email TEXT,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  instagram_handle TEXT,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT,
  city TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  gift_type TEXT NOT NULL,
  gift_for TEXT,
  selected_product_id TEXT,
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

-- 7. All Custom Order Form, Checkout & Inquiry Submissions (connected to tgg_orders & tgg_products)
CREATE TABLE IF NOT EXISTS public.tgg_form_submissions (
  id TEXT PRIMARY KEY,
  submission_type TEXT NOT NULL,
  linked_order_id TEXT,
  linked_product_id TEXT,
  linked_contact_id TEXT,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  instagram_handle TEXT,
  city TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  gift_type TEXT NOT NULL,
  gift_for TEXT,
  budget_range TEXT,
  delivery_date TEXT,
  delivery_time TEXT,
  recipient_name TEXT,
  personal_message TEXT,
  special_requests TEXT,
  submission_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SEO Pages, OpenGraph, Twitter Cards & Schema.org Structured Data
CREATE TABLE IF NOT EXISTS public.tgg_seo_metadata (
  id TEXT PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_name TEXT NOT NULL,
  page_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  meta_keywords TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  og_title TEXT NOT NULL,
  og_description TEXT NOT NULL,
  og_image TEXT NOT NULL,
  twitter_card TEXT NOT NULL,
  twitter_site TEXT NOT NULL,
  google_verification TEXT,
  geo_region TEXT,
  geo_placename TEXT,
  popular_search_tags TEXT,
  schema_org_type TEXT,
  seo_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Social Media Channels & Instagram Feed Posts
CREATE TABLE IF NOT EXISTS public.tgg_social_pages (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  handle TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  caption TEXT NOT NULL,
  likes_count TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  social_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Info & Knowledge Base (Gifting Guide FAQs, How It Works Steps, Delivery Service Pillars)
CREATE TABLE IF NOT EXISTS public.tgg_knowledge_base (
  id TEXT PRIMARY KEY,
  section_type TEXT NOT NULL,
  step_or_order TEXT NOT NULL,
  category_tag TEXT NOT NULL,
  title_or_question TEXT NOT NULL,
  content_or_answer TEXT NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb,
  icon_name TEXT NOT NULL,
  knowledge_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Storefront Policies
CREATE TABLE IF NOT EXISTS public.tgg_policies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  badge_label TEXT NOT NULL,
  short_text TEXT NOT NULL,
  full_details TEXT NOT NULL,
  policy_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Saved Recipients Address Book
CREATE TABLE IF NOT EXISTS public.tgg_recipients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  occasion TEXT NOT NULL,
  date TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  recipient_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Concierge Operational Todos Checklist
CREATE TABLE IF NOT EXISTS public.todos (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relational Indexes for Fast Lookup & Joins
CREATE INDEX IF NOT EXISTS idx_tgg_products_category ON public.tgg_products(category);
CREATE INDEX IF NOT EXISTS idx_tgg_orders_product ON public.tgg_orders(selected_product_id);
CREATE INDEX IF NOT EXISTS idx_tgg_orders_status ON public.tgg_orders(status);
CREATE INDEX IF NOT EXISTS idx_tgg_submissions_order ON public.tgg_form_submissions(linked_order_id);
CREATE INDEX IF NOT EXISTS idx_tgg_contacts_type ON public.tgg_contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_tgg_knowledge_section ON public.tgg_knowledge_base(section_type);

-- Enable Row Level Security (RLS) across all 13 tables
ALTER TABLE public.tgg_app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_social_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tgg_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to tgg_app_state" ON public.tgg_app_state;
CREATE POLICY "Allow all access to tgg_app_state" ON public.tgg_app_state FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_categories" ON public.tgg_categories;
CREATE POLICY "Allow all access to tgg_categories" ON public.tgg_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_products" ON public.tgg_products;
CREATE POLICY "Allow all access to tgg_products" ON public.tgg_products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_occasions" ON public.tgg_occasions;
CREATE POLICY "Allow all access to tgg_occasions" ON public.tgg_occasions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_contacts" ON public.tgg_contacts;
CREATE POLICY "Allow all access to tgg_contacts" ON public.tgg_contacts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_orders" ON public.tgg_orders;
CREATE POLICY "Allow all access to tgg_orders" ON public.tgg_orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_form_submissions" ON public.tgg_form_submissions;
CREATE POLICY "Allow all access to tgg_form_submissions" ON public.tgg_form_submissions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_seo_metadata" ON public.tgg_seo_metadata;
CREATE POLICY "Allow all access to tgg_seo_metadata" ON public.tgg_seo_metadata FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_social_pages" ON public.tgg_social_pages;
CREATE POLICY "Allow all access to tgg_social_pages" ON public.tgg_social_pages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_knowledge_base" ON public.tgg_knowledge_base;
CREATE POLICY "Allow all access to tgg_knowledge_base" ON public.tgg_knowledge_base FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_policies" ON public.tgg_policies;
CREATE POLICY "Allow all access to tgg_policies" ON public.tgg_policies FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to tgg_recipients" ON public.tgg_recipients;
CREATE POLICY "Allow all access to tgg_recipients" ON public.tgg_recipients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to todos" ON public.todos;
CREATE POLICY "Allow all access to todos" ON public.todos FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Generates a complete one-shot SQL script that BOTH creates all 13 tables AND inserts/updates
 * every single record from the live website state (Products, Categories, Occasions, Orders,
 * Form Submissions, Contacts, SEO Metadata, Social Pages, Knowledge Base, Policies,
 * Hero & Bank Settings, Form Options, Saved Recipients, and Todos).
 */
export function generateFullSupabaseBootstrapSQL(snapshot: FullDatabaseSnapshot): string {
  const lines: string[] = [
    SUPABASE_SQL_SCHEMA.trim(),
    '',
    '-- ============================================================================',
    '-- SEED & UPSERT ALL 13 TABLES WITH ACTIVE WEBSITE DATA',
    '-- ============================================================================',
    '',
  ];

  // 1. tgg_app_state rows (15 keys)
  const stateEntries: Array<[string, unknown]> = [
    ['orders', snapshot.orders],
    ['products', snapshot.products],
    ['categories', snapshot.categories],
    ['occasions', snapshot.occasions],
    ['policies', snapshot.policies],
    ['siteSettings', snapshot.siteSettings],
    ['formOptions', snapshot.formOptions],
    ['userProfile', snapshot.userProfile],
    ['savedRecipients', snapshot.savedRecipients],
    ['wishlistIds', snapshot.wishlistIds],
    ['seoMetadata', snapshot.seoMetadata],
    ['socialPages', snapshot.socialPages],
    ['knowledgeBase', snapshot.knowledgeBase],
    ['contacts', snapshot.contacts],
    ['formSubmissions', snapshot.formSubmissions],
  ];

  for (const [key, payload] of stateEntries) {
    lines.push(
      `INSERT INTO public.tgg_app_state (id, payload, updated_at) VALUES (${sqlLiteral(
        key
      )}, ${sqlLiteral(payload)}, NOW()) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW();`
    );
  }

  lines.push('');

  // 2. tgg_categories rows
  for (const c of snapshot.categories) {
    lines.push(
      `INSERT INTO public.tgg_categories (id, name, subtitle, description, icon_name, category_json, updated_at) VALUES (${sqlLiteral(
        c.id
      )}, ${sqlLiteral(c.name)}, ${sqlLiteral(c.subtitle)}, ${sqlLiteral(
        c.description
      )}, ${sqlLiteral(c.iconName)}, ${sqlLiteral(
        c
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, icon_name = EXCLUDED.icon_name, category_json = EXCLUDED.category_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 3. tgg_products rows
  for (const p of snapshot.products) {
    lines.push(
      `INSERT INTO public.tgg_products (id, name, category, tagline, description, image, price_display, is_popular, product_json, updated_at) VALUES (${sqlLiteral(
        p.id
      )}, ${sqlLiteral(p.name)}, ${sqlLiteral(p.category)}, ${sqlLiteral(
        p.tagline
      )}, ${sqlLiteral(p.description)}, ${sqlLiteral(p.image)}, ${sqlLiteral(
        p.priceDisplay
      )}, ${sqlLiteral(Boolean(p.isPopular))}, ${sqlLiteral(
        p
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, tagline = EXCLUDED.tagline, description = EXCLUDED.description, image = EXCLUDED.image, price_display = EXCLUDED.price_display, is_popular = EXCLUDED.is_popular, product_json = EXCLUDED.product_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 4. tgg_occasions rows
  for (const occ of snapshot.occasions) {
    lines.push(
      `INSERT INTO public.tgg_occasions (id, name, tagline, icon_name, occasion_json, updated_at) VALUES (${sqlLiteral(
        occ.id
      )}, ${sqlLiteral(occ.name)}, ${sqlLiteral(occ.tagline)}, ${sqlLiteral(
        occ.iconName
      )}, ${sqlLiteral(
        occ
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, icon_name = EXCLUDED.icon_name, occasion_json = EXCLUDED.occasion_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 5. tgg_contacts rows
  for (const ct of snapshot.contacts) {
    lines.push(
      `INSERT INTO public.tgg_contacts (id, contact_type, full_name, whatsapp_number, email, instagram_handle, city, address, role_or_relationship, notes, linked_order_id, contact_json, updated_at) VALUES (${sqlLiteral(
        ct.id
      )}, ${sqlLiteral(ct.contactType)}, ${sqlLiteral(ct.fullName)}, ${sqlLiteral(
        ct.whatsappNumber
      )}, ${sqlLiteral(ct.email)}, ${sqlLiteral(ct.instagramHandle)}, ${sqlLiteral(
        ct.city
      )}, ${sqlLiteral(ct.address)}, ${sqlLiteral(ct.roleOrRelationship)}, ${sqlLiteral(
        ct.notes
      )}, ${sqlLiteral(ct.linkedOrderId || null)}, ${sqlLiteral(
        ct
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, whatsapp_number = EXCLUDED.whatsapp_number, email = EXCLUDED.email, city = EXCLUDED.city, address = EXCLUDED.address, notes = EXCLUDED.notes, contact_json = EXCLUDED.contact_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 6. tgg_orders rows
  for (const o of snapshot.orders) {
    lines.push(
      `INSERT INTO public.tgg_orders (id, user_email, full_name, whatsapp_number, instagram_handle, recipient_name, recipient_phone, city, delivery_address, gift_type, gift_for, selected_product_id, selected_product_name, selected_product_tier, amount_pkr, payment_method_type, payment_status, status, order_json, updated_at) VALUES (${sqlLiteral(
        o.id
      )}, ${sqlLiteral(o.email || null)}, ${sqlLiteral(o.fullName)}, ${sqlLiteral(
        o.whatsappNumber
      )}, ${sqlLiteral(o.instagramHandle || null)}, ${sqlLiteral(
        o.recipientName
      )}, ${sqlLiteral(o.recipientPhone || null)}, ${sqlLiteral(o.city)}, ${sqlLiteral(
        o.deliveryAddress
      )}, ${sqlLiteral(o.giftType)}, ${sqlLiteral(o.giftFor || null)}, ${sqlLiteral(
        o.selectedProductId || null
      )}, ${sqlLiteral(o.selectedProductName || null)}, ${sqlLiteral(
        o.selectedProductTier || null
      )}, ${sqlLiteral(o.amountPKR || 0)}, ${sqlLiteral(
        o.paymentMethodType || 'Transfer'
      )}, ${sqlLiteral(o.paymentStatus)}, ${sqlLiteral(o.status)}, ${sqlLiteral(
        o
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, payment_status = EXCLUDED.payment_status, amount_pkr = EXCLUDED.amount_pkr, order_json = EXCLUDED.order_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 7. tgg_form_submissions rows
  for (const sub of snapshot.formSubmissions) {
    lines.push(
      `INSERT INTO public.tgg_form_submissions (id, submission_type, linked_order_id, linked_product_id, linked_contact_id, full_name, whatsapp_number, email, instagram_handle, city, delivery_address, gift_type, gift_for, budget_range, delivery_date, delivery_time, recipient_name, personal_message, special_requests, submission_json, created_at) VALUES (${sqlLiteral(
        sub.id
      )}, ${sqlLiteral(sub.submissionType)}, ${sqlLiteral(
        sub.linkedOrderId || null
      )}, ${sqlLiteral(sub.linkedProductId || null)}, ${sqlLiteral(
        sub.linkedContactId || null
      )}, ${sqlLiteral(sub.fullName)}, ${sqlLiteral(sub.whatsappNumber)}, ${sqlLiteral(
        sub.email || null
      )}, ${sqlLiteral(sub.instagramHandle || null)}, ${sqlLiteral(sub.city)}, ${sqlLiteral(
        sub.deliveryAddress
      )}, ${sqlLiteral(sub.giftType)}, ${sqlLiteral(sub.giftFor)}, ${sqlLiteral(
        sub.budgetRange
      )}, ${sqlLiteral(sub.deliveryDate)}, ${sqlLiteral(sub.deliveryTime)}, ${sqlLiteral(
        sub.recipientName
      )}, ${sqlLiteral(sub.personalMessage)}, ${sqlLiteral(
        sub.specialRequests
      )}, ${sqlLiteral(
        sub
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET submission_json = EXCLUDED.submission_json;`
    );
  }

  lines.push('');

  // 8. tgg_seo_metadata rows
  for (const seo of snapshot.seoMetadata) {
    lines.push(
      `INSERT INTO public.tgg_seo_metadata (id, page_path, page_name, page_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image, twitter_card, twitter_site, google_verification, geo_region, geo_placename, popular_search_tags, schema_org_type, seo_json, updated_at) VALUES (${sqlLiteral(
        seo.id
      )}, ${sqlLiteral(seo.pagePath)}, ${sqlLiteral(seo.pageName)}, ${sqlLiteral(
        seo.pageTitle
      )}, ${sqlLiteral(seo.metaDescription)}, ${sqlLiteral(
        seo.metaKeywords
      )}, ${sqlLiteral(seo.canonicalUrl)}, ${sqlLiteral(seo.ogTitle)}, ${sqlLiteral(
        seo.ogDescription
      )}, ${sqlLiteral(seo.ogImage)}, ${sqlLiteral(seo.twitterCard)}, ${sqlLiteral(
        seo.twitterSite
      )}, ${sqlLiteral(seo.googleVerification)}, ${sqlLiteral(
        seo.geoRegion
      )}, ${sqlLiteral(seo.geoPlacename)}, ${sqlLiteral(
        seo.popularSearchTags
      )}, ${sqlLiteral(seo.schemaOrgType)}, ${sqlLiteral(
        seo
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET page_title = EXCLUDED.page_title, meta_description = EXCLUDED.meta_description, meta_keywords = EXCLUDED.meta_keywords, og_title = EXCLUDED.og_title, og_description = EXCLUDED.og_description, popular_search_tags = EXCLUDED.popular_search_tags, seo_json = EXCLUDED.seo_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 9. tgg_social_pages rows
  for (const soc of snapshot.socialPages) {
    lines.push(
      `INSERT INTO public.tgg_social_pages (id, platform, entry_type, handle, url, image_url, caption, likes_count, is_active, social_json, updated_at) VALUES (${sqlLiteral(
        soc.id
      )}, ${sqlLiteral(soc.platform)}, ${sqlLiteral(soc.entryType)}, ${sqlLiteral(
        soc.handle
      )}, ${sqlLiteral(soc.url)}, ${sqlLiteral(soc.imageUrl || null)}, ${sqlLiteral(
        soc.caption
      )}, ${sqlLiteral(soc.likesCount || null)}, ${sqlLiteral(soc.isActive)}, ${sqlLiteral(
        soc
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET handle = EXCLUDED.handle, url = EXCLUDED.url, image_url = EXCLUDED.image_url, caption = EXCLUDED.caption, likes_count = EXCLUDED.likes_count, social_json = EXCLUDED.social_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 10. tgg_knowledge_base rows
  for (const kb of snapshot.knowledgeBase) {
    lines.push(
      `INSERT INTO public.tgg_knowledge_base (id, section_type, step_or_order, category_tag, title_or_question, content_or_answer, keywords, icon_name, knowledge_json, updated_at) VALUES (${sqlLiteral(
        kb.id
      )}, ${sqlLiteral(kb.sectionType)}, ${sqlLiteral(kb.stepOrOrder)}, ${sqlLiteral(
        kb.categoryTag
      )}, ${sqlLiteral(kb.titleOrQuestion)}, ${sqlLiteral(
        kb.contentOrAnswer
      )}, ${sqlLiteral(kb.keywords)}, ${sqlLiteral(kb.iconName)}, ${sqlLiteral(
        kb
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET title_or_question = EXCLUDED.title_or_question, content_or_answer = EXCLUDED.content_or_answer, keywords = EXCLUDED.keywords, knowledge_json = EXCLUDED.knowledge_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 11. tgg_policies rows
  for (const pol of snapshot.policies) {
    lines.push(
      `INSERT INTO public.tgg_policies (id, title, badge_label, short_text, full_details, policy_json, updated_at) VALUES (${sqlLiteral(
        String(pol.id)
      )}, ${sqlLiteral(pol.title)}, ${sqlLiteral(pol.badgeLabel)}, ${sqlLiteral(
        pol.shortText
      )}, ${sqlLiteral(pol.fullDetails)}, ${sqlLiteral(
        pol
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, badge_label = EXCLUDED.badge_label, short_text = EXCLUDED.short_text, full_details = EXCLUDED.full_details, policy_json = EXCLUDED.policy_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 12. tgg_recipients rows
  for (const rec of snapshot.savedRecipients) {
    lines.push(
      `INSERT INTO public.tgg_recipients (id, name, relationship, occasion, date, city, address, notes, recipient_json, updated_at) VALUES (${sqlLiteral(
        rec.id
      )}, ${sqlLiteral(rec.name)}, ${sqlLiteral(rec.relationship)}, ${sqlLiteral(
        rec.occasion
      )}, ${sqlLiteral(rec.date)}, ${sqlLiteral(rec.city)}, ${sqlLiteral(
        rec.address
      )}, ${sqlLiteral(rec.notes || '')}, ${sqlLiteral(
        rec
      )}, NOW()) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, relationship = EXCLUDED.relationship, occasion = EXCLUDED.occasion, date = EXCLUDED.date, city = EXCLUDED.city, address = EXCLUDED.address, notes = EXCLUDED.notes, recipient_json = EXCLUDED.recipient_json, updated_at = NOW();`
    );
  }

  lines.push('');

  // 13. todos rows
  lines.push(
    `INSERT INTO public.todos (id, name, completed) VALUES (1, 'Verify Raqami & MCB Bank transfer settlements', true), (2, 'Dispatch Midnight Surprise hampers for Lahore & Karachi', false), (3, 'Review custom gold-foil vow cards for upcoming orders', false) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, completed = EXCLUDED.completed;`
  );

  return lines.join('\n');
}

/**
 * Upserts a state key into `tgg_app_state` and mirrors structured rows into the corresponding relational table.
 */
export async function syncStateToSupabase(key: string, payload: unknown): Promise<boolean> {
  if (!supabase) return false;
  try {
    const now = new Date().toISOString();
    const { error } = await supabase.from('tgg_app_state').upsert(
      {
        id: key,
        payload,
        updated_at: now,
      },
      { onConflict: 'id' }
    );

    if (key === 'orders' && Array.isArray(payload)) {
      const orderRows = (payload as PortalOrder[]).map((o) => ({
        id: o.id,
        user_email: o.email || null,
        full_name: o.fullName,
        whatsapp_number: o.whatsappNumber,
        instagram_handle: o.instagramHandle || null,
        recipient_name: o.recipientName,
        recipient_phone: o.recipientPhone || null,
        city: o.city,
        delivery_address: o.deliveryAddress,
        gift_type: o.giftType,
        gift_for: o.giftFor || null,
        selected_product_id: o.selectedProductId || null,
        selected_product_name: o.selectedProductName || null,
        selected_product_tier: o.selectedProductTier || null,
        amount_pkr: o.amountPKR || 0,
        payment_method_type: o.paymentMethodType || 'Transfer',
        payment_status: o.paymentStatus,
        status: o.status,
        order_json: o,
        updated_at: now,
      }));
      if (orderRows.length > 0) {
        await supabase.from('tgg_orders').upsert(orderRows, { onConflict: 'id' });
      }
    }

    if (key === 'products' && Array.isArray(payload)) {
      const productRows = (payload as Product[]).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        tagline: p.tagline,
        description: p.description,
        image: p.image,
        price_display: p.priceDisplay,
        is_popular: Boolean(p.isPopular),
        product_json: p,
        updated_at: now,
      }));
      if (productRows.length > 0) {
        await supabase.from('tgg_products').upsert(productRows, { onConflict: 'id' });
      }
    }

    if (key === 'categories' && Array.isArray(payload)) {
      const catRows = (payload as Category[]).map((c) => ({
        id: c.id,
        name: c.name,
        subtitle: c.subtitle,
        description: c.description,
        icon_name: c.iconName,
        category_json: c,
        updated_at: now,
      }));
      if (catRows.length > 0) {
        await supabase.from('tgg_categories').upsert(catRows, { onConflict: 'id' });
      }
    }

    if (key === 'occasions' && Array.isArray(payload)) {
      const occRows = (payload as Occasion[]).map((occ) => ({
        id: occ.id,
        name: occ.name,
        tagline: occ.tagline,
        icon_name: occ.iconName,
        occasion_json: occ,
        updated_at: now,
      }));
      if (occRows.length > 0) {
        await supabase.from('tgg_occasions').upsert(occRows, { onConflict: 'id' });
      }
    }

    if (key === 'policies' && Array.isArray(payload)) {
      const polRows = (payload as PolicyItem[]).map((pol) => ({
        id: String(pol.id),
        title: pol.title,
        badge_label: pol.badgeLabel,
        short_text: pol.shortText,
        full_details: pol.fullDetails,
        policy_json: pol,
        updated_at: now,
      }));
      if (polRows.length > 0) {
        await supabase.from('tgg_policies').upsert(polRows, { onConflict: 'id' });
      }
    }

    if (key === 'savedRecipients' && Array.isArray(payload)) {
      const recRows = (payload as SavedRecipient[]).map((rec) => ({
        id: rec.id,
        name: rec.name,
        relationship: rec.relationship,
        occasion: rec.occasion,
        date: rec.date,
        city: rec.city,
        address: rec.address,
        notes: rec.notes || '',
        recipient_json: rec,
        updated_at: now,
      }));
      if (recRows.length > 0) {
        await supabase.from('tgg_recipients').upsert(recRows, { onConflict: 'id' });
      }
    }

    if (key === 'seoMetadata' && Array.isArray(payload)) {
      const seoRows = (payload as SeoPageMetadata[]).map((seo) => ({
        id: seo.id,
        page_path: seo.pagePath,
        page_name: seo.pageName,
        page_title: seo.pageTitle,
        meta_description: seo.metaDescription,
        meta_keywords: seo.metaKeywords,
        canonical_url: seo.canonicalUrl,
        og_title: seo.ogTitle,
        og_description: seo.ogDescription,
        og_image: seo.ogImage,
        twitter_card: seo.twitterCard,
        twitter_site: seo.twitterSite,
        google_verification: seo.googleVerification,
        geo_region: seo.geoRegion,
        geo_placename: seo.geoPlacename,
        popular_search_tags: seo.popularSearchTags,
        schema_org_type: seo.schemaOrgType,
        seo_json: seo,
        updated_at: now,
      }));
      if (seoRows.length > 0) {
        await supabase.from('tgg_seo_metadata').upsert(seoRows, { onConflict: 'id' });
      }
    }

    if (key === 'socialPages' && Array.isArray(payload)) {
      const socRows = (payload as SocialPageOrPost[]).map((soc) => ({
        id: soc.id,
        platform: soc.platform,
        entry_type: soc.entryType,
        handle: soc.handle,
        url: soc.url,
        image_url: soc.imageUrl || null,
        caption: soc.caption,
        likes_count: soc.likesCount || null,
        is_active: soc.isActive,
        social_json: soc,
        updated_at: now,
      }));
      if (socRows.length > 0) {
        await supabase.from('tgg_social_pages').upsert(socRows, { onConflict: 'id' });
      }
    }

    if (key === 'knowledgeBase' && Array.isArray(payload)) {
      const kbRows = (payload as KnowledgeBaseEntry[]).map((kb) => ({
        id: kb.id,
        section_type: kb.sectionType,
        step_or_order: kb.stepOrOrder,
        category_tag: kb.categoryTag,
        title_or_question: kb.titleOrQuestion,
        content_or_answer: kb.contentOrAnswer,
        keywords: kb.keywords,
        icon_name: kb.iconName,
        knowledge_json: kb,
        updated_at: now,
      }));
      if (kbRows.length > 0) {
        await supabase.from('tgg_knowledge_base').upsert(kbRows, { onConflict: 'id' });
      }
    }

    if (key === 'contacts' && Array.isArray(payload)) {
      const ctRows = (payload as ContactDirectoryEntry[]).map((ct) => ({
        id: ct.id,
        contact_type: ct.contactType,
        full_name: ct.fullName,
        whatsapp_number: ct.whatsappNumber,
        email: ct.email,
        instagram_handle: ct.instagramHandle,
        city: ct.city,
        address: ct.address,
        role_or_relationship: ct.roleOrRelationship,
        notes: ct.notes,
        linked_order_id: ct.linkedOrderId || null,
        contact_json: ct,
        updated_at: now,
      }));
      if (ctRows.length > 0) {
        await supabase.from('tgg_contacts').upsert(ctRows, { onConflict: 'id' });
      }
    }

    if (key === 'formSubmissions' && Array.isArray(payload)) {
      const subRows = (payload as FormSubmissionRecord[]).map((sub) => ({
        id: sub.id,
        submission_type: sub.submissionType,
        linked_order_id: sub.linkedOrderId || null,
        linked_product_id: sub.linkedProductId || null,
        linked_contact_id: sub.linkedContactId || null,
        full_name: sub.fullName,
        whatsapp_number: sub.whatsappNumber,
        email: sub.email || null,
        instagram_handle: sub.instagramHandle || null,
        city: sub.city,
        delivery_address: sub.deliveryAddress,
        gift_type: sub.giftType,
        gift_for: sub.giftFor,
        budget_range: sub.budgetRange,
        delivery_date: sub.deliveryDate,
        delivery_time: sub.deliveryTime,
        recipient_name: sub.recipientName,
        personal_message: sub.personalMessage,
        special_requests: sub.specialRequests,
        submission_json: sub,
        created_at: sub.createdAt || now,
      }));
      if (subRows.length > 0) {
        await supabase.from('tgg_form_submissions').upsert(subRows, { onConflict: 'id' });
      }
    }

    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetches all active state from Supabase (`tgg_app_state` + relational tables).
 */
export async function fetchAllStateFromSupabase(): Promise<Record<string, unknown> | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('tgg_app_state').select('id, payload');
    if (error) return null;

    const map: Record<string, unknown> = {};
    if (data) {
      for (const row of data) {
        map[row.id] = row.payload;
      }
    }

    const [ordersRes, productsRes] = await Promise.all([
      supabase.from('tgg_orders').select('order_json').order('created_at', { ascending: false }),
      supabase.from('tgg_products').select('product_json'),
    ]);

    if (!ordersRes.error && ordersRes.data && ordersRes.data.length > 0) {
      const relationalOrders = ordersRes.data
        .map((r) => r.order_json as PortalOrder)
        .filter(Boolean);
      if (relationalOrders.length > 0) {
        map.orders = relationalOrders;
      }
    }

    if (!productsRes.error && productsRes.data && productsRes.data.length > 0) {
      const relationalProducts = productsRes.data
        .map((r) => r.product_json as Product)
        .filter(Boolean);
      if (relationalProducts.length > 0) {
        map.products = relationalProducts;
      }
    }

    return Object.keys(map).length > 0 ? map : {};
  } catch {
    return null;
  }
}

/**
 * Full Two-Way Database Sync & Table Provisioning Engine across all 13 tables.
 */
export async function pushAndSyncFullDatabase(
  snapshot: FullDatabaseSnapshot,
  options?: { accessToken?: string }
): Promise<SupabaseSyncResult> {
  const now = new Date().toISOString();
  if (!supabase) {
    return {
      status: 'error',
      tablesReady: false,
      recordsPushed: 0,
      tablesSynced: [],
      missingTables: ['tgg_app_state'],
      lastSyncedAt: now,
      message: 'Supabase client is not configured.',
    };
  }

  // Step 1: If a Supabase Personal Access Token (sbp_...) is provided, execute full DDL + Seed via Management API
  if (options?.accessToken && options.accessToken.trim().length > 10) {
    try {
      const fullSql = generateFullSupabaseBootstrapSQL(snapshot);
      await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${options.accessToken.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: fullSql }),
      });
    } catch {
      // Proceed to RPC / REST checks below
    }
  }

  // Step 2: Attempt `exec_sql` RPC in case the function is already installed in Supabase
  try {
    await supabase.rpc('exec_sql', { sql: SUPABASE_SQL_SCHEMA });
  } catch {
    // Ignore if exec_sql does not exist yet
  }

  // Step 3: Push all 15 state keys into `tgg_app_state`
  const stateRows = [
    { id: 'orders', payload: snapshot.orders, updated_at: now },
    { id: 'products', payload: snapshot.products, updated_at: now },
    { id: 'categories', payload: snapshot.categories, updated_at: now },
    { id: 'occasions', payload: snapshot.occasions, updated_at: now },
    { id: 'policies', payload: snapshot.policies, updated_at: now },
    { id: 'siteSettings', payload: snapshot.siteSettings, updated_at: now },
    { id: 'formOptions', payload: snapshot.formOptions, updated_at: now },
    { id: 'userProfile', payload: snapshot.userProfile, updated_at: now },
    { id: 'savedRecipients', payload: snapshot.savedRecipients, updated_at: now },
    { id: 'wishlistIds', payload: snapshot.wishlistIds, updated_at: now },
    { id: 'seoMetadata', payload: snapshot.seoMetadata, updated_at: now },
    { id: 'socialPages', payload: snapshot.socialPages, updated_at: now },
    { id: 'knowledgeBase', payload: snapshot.knowledgeBase, updated_at: now },
    { id: 'contacts', payload: snapshot.contacts, updated_at: now },
    { id: 'formSubmissions', payload: snapshot.formSubmissions, updated_at: now },
  ];

  const appStateRes = await supabase
    .from('tgg_app_state')
    .upsert(stateRows, { onConflict: 'id' });

  if (appStateRes.error) {
    const isMissingTable =
      appStateRes.error.message?.includes('schema cache') ||
      appStateRes.error.message?.includes('does not exist') ||
      appStateRes.error.code === 'PGRST205' ||
      appStateRes.error.code === '42P01';

    try {
      const channel = supabase.channel('tgg_active_db_sync');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'db_state_updated',
            payload: snapshot,
          });
        }
      });
    } catch {
      // ignore
    }

    if (isMissingTable) {
      return {
        status: 'schema_required',
        tablesReady: false,
        recordsPushed: 0,
        tablesSynced: [],
        missingTables: [
          'tgg_app_state',
          'tgg_categories',
          'tgg_products',
          'tgg_occasions',
          'tgg_contacts',
          'tgg_orders',
          'tgg_form_submissions',
          'tgg_seo_metadata',
          'tgg_social_pages',
          'tgg_knowledge_base',
          'tgg_policies',
          'tgg_recipients',
          'todos',
        ],
        lastSyncedAt: now,
        message:
          'Tables are not yet created in Supabase. Click "Copy Full CREATE TABLE + INSERT SQL" and run it once in your Supabase SQL Editor (or enter a Supabase Access Token) to create all 13 tables and populate all data.',
      };
    }

    return {
      status: 'error',
      tablesReady: false,
      recordsPushed: 0,
      tablesSynced: [],
      missingTables: [],
      lastSyncedAt: now,
      message: appStateRes.error.message || 'Failed to push data to Supabase.',
    };
  }

  // Step 4: Upsert all 12 relational tables
  const tablesSynced: string[] = ['tgg_app_state'];
  const missingTables: string[] = [];
  let totalRecords = stateRows.length;

  const results = await Promise.all([
    syncStateToSupabase('categories', snapshot.categories),
    syncStateToSupabase('products', snapshot.products),
    syncStateToSupabase('occasions', snapshot.occasions),
    syncStateToSupabase('contacts', snapshot.contacts),
    syncStateToSupabase('orders', snapshot.orders),
    syncStateToSupabase('formSubmissions', snapshot.formSubmissions),
    syncStateToSupabase('seoMetadata', snapshot.seoMetadata),
    syncStateToSupabase('socialPages', snapshot.socialPages),
    syncStateToSupabase('knowledgeBase', snapshot.knowledgeBase),
    syncStateToSupabase('policies', snapshot.policies),
    syncStateToSupabase('savedRecipients', snapshot.savedRecipients),
    supabase.from('todos').upsert(
      [
        { id: 1, name: 'Verify Raqami & MCB Bank transfer settlements', completed: true },
        { id: 2, name: 'Dispatch Midnight Surprise hampers for Lahore & Karachi', completed: false },
        { id: 3, name: 'Review custom gold-foil vow cards for upcoming orders', completed: false },
      ],
      { onConflict: 'id' }
    ),
  ]);

  const tableSpecs: Array<{ name: string; count: number; ok: boolean }> = [
    { name: 'tgg_categories', count: snapshot.categories.length, ok: Boolean(results[0]) },
    { name: 'tgg_products', count: snapshot.products.length, ok: Boolean(results[1]) },
    { name: 'tgg_occasions', count: snapshot.occasions.length, ok: Boolean(results[2]) },
    { name: 'tgg_contacts', count: snapshot.contacts.length, ok: Boolean(results[3]) },
    { name: 'tgg_orders', count: snapshot.orders.length, ok: Boolean(results[4]) },
    { name: 'tgg_form_submissions', count: snapshot.formSubmissions.length, ok: Boolean(results[5]) },
    { name: 'tgg_seo_metadata', count: snapshot.seoMetadata.length, ok: Boolean(results[6]) },
    { name: 'tgg_social_pages', count: snapshot.socialPages.length, ok: Boolean(results[7]) },
    { name: 'tgg_knowledge_base', count: snapshot.knowledgeBase.length, ok: Boolean(results[8]) },
    { name: 'tgg_policies', count: snapshot.policies.length, ok: Boolean(results[9]) },
    { name: 'tgg_recipients', count: snapshot.savedRecipients.length, ok: Boolean(results[10]) },
    { name: 'todos', count: 3, ok: !results[11].error },
  ];

  for (const spec of tableSpecs) {
    if (spec.ok) {
      tablesSynced.push(spec.name);
      totalRecords += spec.count;
    } else {
      missingTables.push(spec.name);
    }
  }

  try {
    const channel = supabase.channel('tgg_active_db_sync');
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'db_state_updated',
          payload: snapshot,
        });
      }
    });
  } catch {
    // ignore
  }

  return {
    status: 'synced',
    tablesReady: true,
    recordsPushed: totalRecords,
    tablesSynced,
    missingTables,
    lastSyncedAt: now,
    message: `Successfully synced ${totalRecords} records across ${tablesSynced.length} Supabase tables and updated the live website.`,
  };
}
