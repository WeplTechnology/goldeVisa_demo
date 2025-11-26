import { formatFileSize, getFileTypeLabel } from './file-utils'
import { formatDate } from './date-formatter'
import type { DocumentData } from '@/lib/actions/document-actions'

export interface TransformedDocument {
  id: string
  name: string
  category: 'identity' | 'financial' | 'property' | 'legal' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  uploadDate: string
  size: string
  type: string
  verifiedBy?: string
  verifiedDate?: string
  notes?: string
}

/**
 * Transforms raw document data from Supabase to the UI-friendly format
 */
export function transformDocumentData(docsData: DocumentData[]): TransformedDocument[] {
  return docsData.map(doc => ({
    id: doc.id,
    name: doc.name,
    category: doc.category,
    status: doc.status,
    uploadDate: formatDate(doc.uploaded_at),
    size: formatFileSize(doc.file_size),
    type: getFileTypeLabel(doc.file_type),
    verifiedBy: doc.verified_by || undefined,
    verifiedDate: doc.verified_at ? formatDate(doc.verified_at) : undefined,
    notes: doc.verification_notes || undefined
  }))
}
