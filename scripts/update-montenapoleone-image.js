/**
 * Script para actualizar la imagen de Via Montenapoleone 8
 * Cambia a una imagen de lujo única diferente a Piazza Duomo
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Imágenes de lujo exclusivas para Via Montenapoleone 8
// (zona de ultra lujo en Milano, distrito de moda)
const LUXURY_IMAGES = [
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop', // Luxury bedroom
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop', // High-end living room
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop', // Modern luxury interior
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop', // Designer kitchen
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop', // Penthouse view
]

async function main() {
  console.log('🏢 Actualizando imagen de Via Montenapoleone 8...\n')

  // 1. Buscar la propiedad Via Montenapoleone 8
  const { data: property, error: searchError } = await supabase
    .from('properties')
    .select('*')
    .ilike('name', '%Montenapoleone%')
    .single()

  if (searchError || !property) {
    console.error('❌ Error: No se encontró Via Montenapoleone 8')
    console.error('   Detalle:', searchError?.message)
    return
  }

  console.log(`✅ Propiedad encontrada: ${property.name}`)
  console.log(`   ID: ${property.id}`)
  console.log(`   Imágenes actuales: ${property.images?.length || 0}\n`)

  // 2. Actualizar con nuevas imágenes de lujo
  const { error: updateError } = await supabase
    .from('properties')
    .update({
      images: LUXURY_IMAGES,
      updated_at: new Date().toISOString()
    })
    .eq('id', property.id)

  if (updateError) {
    console.error('❌ Error actualizando:', updateError.message)
    return
  }

  console.log('✅ Imágenes actualizadas exitosamente!')
  console.log(`   Nuevas imágenes: ${LUXURY_IMAGES.length}`)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✨ Via Montenapoleone 8 ahora tiene imágenes exclusivas de lujo')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error fatal:', err)
    process.exit(1)
  })
