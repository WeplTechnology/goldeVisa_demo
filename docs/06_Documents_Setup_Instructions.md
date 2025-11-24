# Documents Setup Instructions

## Overview
This document provides instructions for setting up the Documents feature in Supabase, including the database table and Storage bucket configuration.

## Prerequisites
- Access to your Supabase project dashboard
- SQL Editor access
- Storage access

## Step 1: Create Documents Table

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `lib/supabase/documents-schema.sql`
5. Click **Run** to execute the SQL

This will create:
- `documents` table with all necessary columns
- Indexes for better query performance
- Row Level Security (RLS) policies for investors and admins
- Sample data for demo investor (Zhang Wei)

## Step 2: Create Storage Bucket

### Option A: Via Dashboard (Recommended)

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Enter the following details:
   - **Name**: `documents`
   - **Public bucket**: ❌ Unchecked (private bucket)
   - **File size limit**: 10 MB (optional)
   - **Allowed MIME types**: Leave empty or specify: `application/pdf, image/jpeg, image/png`
4. Click **Create bucket**

### Option B: Via SQL

Run this SQL in the SQL Editor:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);
```

## Step 3: Configure Storage Policies

1. Go to **Storage** → **Policies**
2. Select the `documents` bucket
3. Create the following policies:

### Policy 1: Users can upload own documents

```sql
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Users can view own documents

```sql
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 3: Users can delete own documents

```sql
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 4: Admins can access all documents

```sql
CREATE POLICY "Admins can access all documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )
);
```

## Step 4: Verify Setup

### Test Database Table

Run this query to verify the documents table was created:

```sql
SELECT * FROM documents;
```

You should see 6 sample documents for the demo investor.

### Test Storage Bucket

1. Go to **Storage** → **documents**
2. You should see an empty bucket
3. Try uploading a test file (it should fail due to RLS unless you're authenticated)

## Step 5: Upload Sample Files (Optional)

Since we created sample document records, you can optionally upload actual files to match:

1. Create folders in the Storage bucket: `{user_id}/identity/`, `{user_id}/financial/`, etc.
2. Upload sample PDFs with the names specified in the database

**Note**: The file paths in the database follow this pattern:
```
{user_id}/{category}/{filename}
```

For example:
```
550e8400-e29b-41d4-a716-446655440000/identity/passport_zhang_wei.pdf
```

## Data Structure

### Documents Table Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `investor_id` | UUID | Foreign key to investors table |
| `fund_id` | UUID | Foreign key to funds table |
| `name` | VARCHAR(255) | Document display name |
| `category` | VARCHAR(50) | identity, financial, property, legal, other |
| `document_type` | VARCHAR(50) | passport, bank_statement, etc. |
| `file_name` | VARCHAR(255) | Original file name |
| `file_path` | VARCHAR(500) | Path in Supabase Storage |
| `file_size` | INTEGER | Size in bytes |
| `file_type` | VARCHAR(100) | MIME type |
| `status` | VARCHAR(50) | pending, approved, rejected |
| `verification_status` | VARCHAR(50) | unverified, verified, rejected |
| `verified_by` | UUID | Admin user who verified |
| `verified_at` | TIMESTAMP | When verified |
| `uploaded_by` | UUID | User who uploaded |
| `uploaded_at` | TIMESTAMP | When uploaded |
| `is_required` | BOOLEAN | If required for Golden Visa |
| `requirement_type` | VARCHAR(100) | Type of requirement |

## Features Implemented

✅ **List Documents**: Fetch all documents for authenticated investor
✅ **Filter by Category**: Filter documents by identity, financial, property, legal, other
✅ **Search Documents**: Search by document name
✅ **Document Stats**: Count total, approved, pending, rejected documents
✅ **Download Documents**: Generate signed URLs for secure downloads (60s expiry)
✅ **Delete Documents**: Soft delete with confirmation dialog
✅ **Required Checklist**: Track required documents for Golden Visa application
✅ **Loading States**: Show loading spinners during data fetch
✅ **RLS Security**: Investors can only see their own documents, admins see all

## File Upload (To Be Implemented)

The upload functionality is prepared but not yet fully implemented. To complete it:

1. Add file input component to the upload section
2. Implement client-side file validation (size, type)
3. Upload file to Supabase Storage using `storage.from('documents').upload()`
4. Call `createDocumentRecord()` to create database entry
5. Refresh document list after successful upload

Example client-side upload code:

```typescript
const handleFileUpload = async (file: File) => {
  const user = supabase.auth.getUser()
  const filePath = `${user.id}/${category}/${file.name}`

  // Upload to storage
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    return
  }

  // Create database record
  await createDocumentRecord({
    name: 'Display Name',
    category: 'identity',
    document_type: 'passport',
    file_name: file.name,
    file_path: filePath,
    file_size: file.size,
    file_type: file.type,
    is_required: true,
    requirement_type: 'passport'
  })
}
```

## Troubleshooting

### Cannot see documents
- Check that the demo investor exists in your database
- Verify you're logged in as the demo investor user
- Check RLS policies are enabled

### Download not working
- Verify the Storage bucket exists
- Check Storage RLS policies are configured
- Ensure files exist at the specified paths

### Upload not working
- Check file size limits (10 MB default)
- Verify MIME type is allowed
- Check Storage RLS policies for INSERT

## Next Steps

After completing this setup:

1. ✅ Database table created
2. ✅ Storage bucket configured
3. ✅ RLS policies applied
4. ✅ Sample data inserted
5. ⏳ Implement file upload UI (optional)
6. ⏳ Upload actual sample files (optional)

The Documents page is now fully functional and will display real data from Supabase!

## Response to Your Question

> "se supone que ahora mismo todos los datos que sale en nuestra plataforma existen en supabase, si creo mas campos en supabase se mostrarian tambien en la paltaforma?"

**Respuesta**: ¡Exacto! Una vez que ejecutes el SQL schema en Supabase y crees el bucket de Storage, **SÍ** - si añades más documentos en Supabase se mostrarán automáticamente en la plataforma.

La página Documents ahora está 100% conectada a Supabase, igual que Dashboard, Golden Visa, Properties y Reports.

**Cómo agregar más documentos manualmente en Supabase:**

1. Ve a **Table Editor** → **documents**
2. Click **Insert row**
3. Completa los campos necesarios (investor_id, name, category, file_path, etc.)
4. Guarda el registro

El nuevo documento aparecerá inmediatamente en la plataforma cuando recargues la página `/documents`.

**Páginas ahora 100% conectadas a Supabase:**
- ✅ Dashboard
- ✅ Golden Visa
- ✅ Properties
- ✅ Reports
- ✅ Documents

**Páginas que aún necesitan integración:**
- ⏳ Messages (usa Gemini API pero no persiste en DB)
- ⏳ Settings (principalmente UI, algunos settings podrían ir a DB)
