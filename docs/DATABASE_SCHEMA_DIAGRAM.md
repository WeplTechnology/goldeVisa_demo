# 🗺️ Database Schema Diagram

## Current vs Required Schema

### ✅ EXISTING TABLES

```
┌─────────────────────────┐
│      auth.users         │
│   (Supabase Auth)       │
└────────────┬────────────┘
             │
             │ user_id (FK)
             ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│       investors         │         │         funds           │
├─────────────────────────┤         ├─────────────────────────┤
│ id (PK)            uuid │         │ id (PK)            uuid │
│ user_id (FK)       uuid │         │ name               text │
│ full_name          text │         │ description        text │
│ email              text │         │ target_amount   numeric │
│ phone              text │         │ current_amount  numeric │
│ nationality        text │         │ status             text │
│ date_of_birth      date │         │ created_at  timestamptz │
│ address            text │         │ updated_at  timestamptz │
│ city               text │         └─────────────────────────┘
│ country            text │
│ postal_code        text │
│ created_at  timestamptz │
│ updated_at  timestamptz │
└─────────────────────────┘
```

### ❌ MISSING TABLES (CAUSING BLANK DATA)

```
┌─────────────────────────────────────────────────────────────────┐
│                        investments                               │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                 uuid                                     │
│ investor_id (FK)        uuid  ──────────┐                       │
│ fund_id (FK)            uuid  ──────┐   │                       │
│ property_id (FK)        uuid  ──┐   │   │                       │
│ amount               numeric    │   │   │                       │
│ investment_date  timestamptz    │   │   │                       │
│ status                  text    │   │   │                       │
│ notes                   text    │   │   │                       │
│ created_at       timestamptz    │   │   │                       │
│ updated_at       timestamptz    │   │   │                       │
└─────────────────────────────────┼───┼───┼───────────────────────┘
                                  │   │   │
                                  │   │   └──────┐
                                  │   │          │
                                  │   └──────┐   │
                                  │          │   │
                 ┌────────────────┘          │   │
                 ▼                           ▼   ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│      properties         │     │         funds           │
├─────────────────────────┤     │     (already exists)    │
│ id (PK)            uuid │     └─────────────────────────┘
│ name               text │
│ location           text │     ┌─────────────────────────┐
│ property_type      text │     │       investors         │
│ price           numeric │     │    (already exists)     │
│ size_sqm        numeric │     └─────────────────────────┘
│ status             text │
│ description        text │
│ image_url          text │
│ created_at  timestamptz │
│ updated_at  timestamptz │
└─────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│              golden_visa_applications                            │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                 uuid                                     │
│ investor_id (FK)        uuid  ─────────────────┐                │
│ status                  text                    │                │
│ application_date  timestamptz                   │                │
│ approval_date     timestamptz                   │                │
│ current_step         integer                    │                │
│ notes                   text                    │                │
│ created_at       timestamptz                    │                │
│ updated_at       timestamptz                    │                │
└─────────────────────────────────────────────────┼────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────┐
                                    │       investors         │
                                    │    (already exists)     │
                                    └─────────────────────────┘
```

### ⚠️ INCOMPLETE TABLE (MISSING COLUMN)

```
┌─────────────────────────────────────────────────────────────────┐
│                         documents                                │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                 uuid                                     │
│ investor_id (FK)        uuid  ─────────────────┐                │
│ document_type           text                    │                │
│ file_name               text                    │                │
│ file_url                text                    │                │
│ file_size            integer                    │                │
│ status                  text                    │                │
│ verification_notes      text                    │                │
│ verified_by             text                    │                │
│ verified_at      timestamptz                    │                │
│ uploaded_at      timestamptz                    │                │
│ deleted_at       timestamptz  ◄──── MISSING!    │                │
│ created_at       timestamptz                    │                │
│ updated_at       timestamptz                    │                │
└─────────────────────────────────────────────────┼────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────┐
                                    │       investors         │
                                    │    (already exists)     │
                                    └─────────────────────────┘
```

---

## Complete Schema with All Tables

```
                    ┌─────────────────────────┐
                    │      auth.users         │
                    │   (Supabase Auth)       │
                    └────────────┬────────────┘
                                 │
                                 │ user_id (FK)
                                 ▼
                    ┌─────────────────────────┐
                    │       investors         │
                    │ ✅ EXISTS               │
                    └────┬────────────────┬───┘
                         │                │
         ┌───────────────┼────────────────┼───────────────┐
         │               │                │               │
         ▼               ▼                ▼               ▼
┌────────────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐
│  investments   │  │ documents│  │ golden_visa  │  │   (other)   │
│ ❌ MISSING     │  │⚠️ MISSING│  │ applications │  │             │
│                │  │  COLUMN  │  │❌ MISSING    │  │             │
└────┬───────────┘  └──────────┘  └──────────────┘  └─────────────┘
     │
     ├─────────────┐
     │             │
     ▼             ▼
┌─────────┐  ┌──────────┐
│  funds  │  │properties│
│✅ EXISTS│  │❌ MISSING│
└─────────┘  └──────────┘
```

---

## Foreign Key Relationships

### Critical Relationships (Required for PostgREST Queries)

```
investments.investor_id ──────────► investors.id  [CASCADE DELETE]
investments.fund_id ──────────────► funds.id      [SET NULL]
investments.property_id ──────────► properties.id [SET NULL]

golden_visa_applications.investor_id ──► investors.id [CASCADE DELETE]

documents.investor_id ────────────► investors.id  [CASCADE DELETE]
```

### Why These Are Critical

PostgREST (Supabase's API) uses these foreign keys to enable embedded queries:

```typescript
// ❌ This FAILS without FK:
.select(`
  *,
  investments (...)  // Error: relationship not found
`)

// ✅ This WORKS with FK:
.select(`
  *,
  investments (...)  // PostgREST uses FK to join
`)
```

---

## Table Status Summary

| Table | Status | Impact on Admin Platform |
|-------|--------|--------------------------|
| `investors` | ✅ EXISTS | ✅ Investor names showing |
| `funds` | ✅ EXISTS | ✅ Fund data available |
| `investments` | ❌ MISSING | ❌ No investment data anywhere |
| `golden_visa_applications` | ❌ MISSING | ❌ Golden Visa page blank |
| `properties` | ❌ MISSING | ❌ Properties page blank |
| `documents` | ⚠️ INCOMPLETE | ❌ Documents page errors |

---

## Data Flow Impact

### Without Missing Tables:
```
Admin Dashboard
  ├─ Total Investors: ✅ 5 (from investors table)
  ├─ Total Investments: ❌ 0 (investments table missing)
  ├─ Total Capital: ❌ €0 (investments table missing)
  ├─ Active Visa Apps: ❌ 0 (golden_visa_applications missing)
  └─ Pending Docs: ❌ Error (documents.deleted_at missing)

Admin Investors Page
  ├─ Investor Names: ✅ Showing
  └─ Investment Amounts: ❌ Blank (investments table missing)

Admin Golden Visa Page: ❌ Completely Blank

Admin Properties Page: ❌ Completely Blank

Admin Documents Page: ❌ Query Error
```

### With Complete Schema:
```
Admin Dashboard
  ├─ Total Investors: ✅ 5
  ├─ Total Investments: ✅ 12
  ├─ Total Capital: ✅ €6.5M
  ├─ Active Visa Apps: ✅ 8
  └─ Pending Docs: ✅ 15

Admin Investors Page
  ├─ Investor Names: ✅ All showing
  └─ Investment Amounts: ✅ All showing with totals

Admin Golden Visa Page: ✅ All applications with status

Admin Properties Page: ✅ All properties with investment progress

Admin Documents Page: ✅ All documents for verification
```

---

## Solution

Execute `lib/supabase/complete-schema.sql` in Supabase SQL Editor to:
1. Create `investments` table with all FKs
2. Create `golden_visa_applications` table
3. Create `properties` table
4. Add `deleted_at` column to `documents`
5. Configure all RLS policies
6. Add performance indexes
7. Set up automatic timestamp triggers

**Time to fix**: ~5 minutes  
**Result**: All admin pages will show complete data
