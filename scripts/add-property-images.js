/**
 * Script para añadir imágenes reales a las propiedades
 * Usa URLs de imágenes de stock de alta calidad de propiedades italianas
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Imágenes de propiedades italianas de alta calidad (Unsplash)
const PROPERTY_IMAGES = {
  milano: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop', // Milano apartment
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop', // Modern living room
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', // Milano city view
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', // Luxury apartment
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', // Modern interior
  ],
  roma: [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=800&fit=crop', // Rome architecture
    'https://images.unsplash.com/photo-1509600110300-21b9d5fedeb7?w=1200&h=800&fit=crop', // Italian apartment
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop', // Rome historic building
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', // Modern kitchen
  ],
  firenze: [
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&h=800&fit=crop', // Florence architecture
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop', // Italian interior
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop', // Classic bedroom
  ],
  bologna: [
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop', // Student apartment
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop', // Modern study room
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', // Cozy living space
  ],
  default: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', // Modern house
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&h=800&fit=crop', // Italian villa
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop', // Luxury property
  ]
}

// Función para obtener imágenes según la ciudad
function getImagesForProperty(property) {
  const cityLower = property.city.toLowerCase()

  let images = []
  if (cityLower.includes('milano') || cityLower.includes('milan')) {
    images = PROPERTY_IMAGES.milano
  } else if (cityLower.includes('roma') || cityLower.includes('rome')) {
    images = PROPERTY_IMAGES.roma
  } else if (cityLower.includes('firenze') || cityLower.includes('florence') || cityLower.includes('florencia')) {
    images = PROPERTY_IMAGES.firenze
  } else if (cityLower.includes('bologna')) {
    images = PROPERTY_IMAGES.bologna
  } else {
    images = PROPERTY_IMAGES.default
  }

  // Seleccionar 3-5 imágenes aleatorias
  const numImages = Math.floor(Math.random() * 3) + 3 // 3 a 5 imágenes
  const shuffled = [...images].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numImages)
}

async function main() {
  console.log('🖼️  Iniciando adición de imágenes a propiedades...\n')

  // 1. Obtener todas las propiedades
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')

  if (propertiesError || !properties) {
    console.error('❌ Error obteniendo propiedades:', propertiesError)
    return
  }

  console.log(`📊 Propiedades encontradas: ${properties.length}\n`)

  // 2. Actualizar imágenes para cada propiedad
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (const property of properties) {
    try {
      console.log(`🏠 Procesando: ${property.name}`)

      // Verificar si ya tiene imágenes
      if (property.images && property.images.length > 0) {
        console.log(`   ⏭️  Ya tiene ${property.images.length} imágenes, saltando...\n`)
        skippedCount++
        continue
      }

      // Generar array de imágenes
      const images = getImagesForProperty(property)

      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          images: images,
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id)

      if (updateError) {
        console.error(`   ❌ Error actualizando:`, updateError.message)
        errorCount++
      } else {
        console.log(`   ✅ ${images.length} imágenes añadidas`)
        successCount++
      }
      console.log('')
    } catch (err) {
      console.error(`   ❌ Error inesperado:`, err.message)
      errorCount++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 RESUMEN')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Propiedades actualizadas: ${successCount}`)
  console.log(`⏭️  Propiedades saltadas (ya tenían imágenes): ${skippedCount}`)
  console.log(`❌ Errores: ${errorCount}`)
  console.log(`📁 Total propiedades: ${properties.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error fatal:', err)
    process.exit(1)
  })
