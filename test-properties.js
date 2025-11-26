const { createClient } = require('@supabase/supabase-js')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Testing Properties Query...\n')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProperties() {
  try {
    // Test 1: Get all properties
    console.log('📊 Test 1: Get All Properties')
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')

    if (propertiesError) {
      console.error('❌ Error:', propertiesError)
    } else {
      console.log('✅ Properties found:', properties.length)
      if (properties.length > 0) {
        console.log('Sample property:', properties[0])
      }
    }
    console.log('---\n')

    // Test 2: Get properties with investments JOIN
    console.log('📊 Test 2: Properties with Investments JOIN')
    const { data: propsWithInvestments, error: joinError } = await supabase
      .from('properties')
      .select(`
        *,
        investments (
          id,
          amount,
          investor:investors (
            full_name,
            email
          )
        )
      `)

    if (joinError) {
      console.error('❌ Error:', joinError)
    } else {
      console.log('✅ Properties with investments:', propsWithInvestments.length)
      if (propsWithInvestments.length > 0) {
        const prop = propsWithInvestments[0]
        console.log('\nFirst property:')
        console.log('  Name:', prop.name)
        console.log('  Price:', prop.price)
        console.log('  Location:', prop.location)
        console.log('  Investments:', prop.investments?.length || 0)
        console.log('  Full data:', JSON.stringify(prop, null, 2))
      }
    }
    console.log('---\n')

    // Test 3: Calculate totals
    console.log('📊 Test 3: Calculate Totals')
    if (propsWithInvestments) {
      const totalValue = propsWithInvestments.reduce((sum, prop) => sum + (prop.price || 0), 0)
      const totalInvestors = propsWithInvestments.reduce((sum, prop) => sum + (prop.investments?.length || 0), 0)

      console.log('Total Properties:', propsWithInvestments.length)
      console.log('Total Value: €' + totalValue.toLocaleString())
      console.log('Total Investors:', totalInvestors)
    }

  } catch (error) {
    console.error('💥 Exception:', error.message)
  }
}

testProperties()
