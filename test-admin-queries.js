const { createClient } = require('@supabase/supabase-js')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseKey)
console.log('---\n')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testQueries() {
  try {
    // Test 1: Count investors
    console.log('📊 Test 1: Count Investors')
    const { data: investors, error: investorsError } = await supabase
      .from('investors')
      .select('*')

    if (investorsError) {
      console.error('❌ Error:', investorsError)
    } else {
      console.log('✅ Investors found:', investors.length)
      console.log('Sample:', investors[0]?.full_name || 'No data')
    }
    console.log('---\n')

    // Test 2: Count investments
    console.log('📊 Test 2: Count Investments')
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('*')

    if (investmentsError) {
      console.error('❌ Error:', investmentsError)
    } else {
      console.log('✅ Investments found:', investments.length)
      console.log('Sample amount:', investments[0]?.amount || 'No data')
    }
    console.log('---\n')

    // Test 3: Investments with JOIN (without target_amount)
    console.log('📊 Test 3: Investments with JOIN')
    const { data: investmentsWithJoin, error: joinError } = await supabase
      .from('investments')
      .select(`
        *,
        investor:investors (
          id,
          full_name,
          email
        ),
        fund:funds (
          id,
          name
        )
      `)
      .limit(3)

    if (joinError) {
      console.error('❌ Error:', joinError)
    } else {
      console.log('✅ Investments with JOIN found:', investmentsWithJoin.length)
      console.log('Sample:', JSON.stringify(investmentsWithJoin[0], null, 2))
    }
    console.log('---\n')

    // Test 4: Golden Visa Applications
    console.log('📊 Test 4: Golden Visa Applications')
    const { data: applications, error: appsError } = await supabase
      .from('golden_visa_applications')
      .select('*')

    if (appsError) {
      console.error('❌ Error:', appsError)
    } else {
      console.log('✅ Applications found:', applications.length)
      console.log('Sample status:', applications[0]?.status || 'No data')
    }
    console.log('---\n')

    // Test 5: Check funds table structure
    console.log('📊 Test 5: Funds Table Structure')
    const { data: funds, error: fundsError } = await supabase
      .from('funds')
      .select('*')
      .limit(1)

    if (fundsError) {
      console.error('❌ Error:', fundsError)
    } else {
      console.log('✅ Funds columns:', Object.keys(funds[0] || {}))
      console.log('Sample fund:', JSON.stringify(funds[0], null, 2))
    }

  } catch (error) {
    console.error('💥 Exception:', error.message)
  }
}

testQueries()
