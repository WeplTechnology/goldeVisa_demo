// Script de prueba para verificar conexión con Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://nsfympzgzdfpiarflshb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZnltcHpnemRmcGlhcmZsc2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTk3OTUsImV4cCI6MjA3OTQ3NTc5NX0.rxb09FslRBJztoqbhYiZ4PMly8hnADwBIv8idzMN_Y0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...\n')

  // Test 1: Verificar que podemos conectar
  console.log('Test 1: Verificar tablas existentes')
  try {
    const { data, error } = await supabase
      .from('investors')
      .select('count')
      .limit(1)

    if (error) {
      console.log('❌ Error al consultar investors:', error)
    } else {
      console.log('✅ Conexión exitosa. Tabla investors existe')
    }
  } catch (err) {
    console.log('❌ Excepción:', err.message)
  }

  // Test 2: Intentar autenticación con credenciales de demo
  console.log('\nTest 2: Autenticación con credenciales de demo')
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'zhang.wei@email.com',
      password: 'Demo2024!'
    })

    if (authError) {
      console.log('❌ Error de autenticación:', authError.message)
    } else {
      console.log('✅ Autenticación exitosa!')
      console.log('   User ID:', authData.user.id)
      console.log('   Email:', authData.user.email)

      // Test 3: Consultar investors con usuario autenticado
      console.log('\nTest 3: Consultar tabla investors con usuario autenticado')
      const { data: investorData, error: investorError } = await supabase
        .from('investors')
        .select('id, full_name, email, user_id')
        .eq('user_id', authData.user.id)
        .maybeSingle()

      if (investorError) {
        console.log('❌ Error al consultar investor:', investorError)
        console.log('   Código:', investorError.code)
        console.log('   Detalles:', investorError.details)
        console.log('   Hint:', investorError.hint)
      } else if (!investorData) {
        console.log('⚠️  No se encontró investor para este user_id')

        // Test 3b: Ver todos los investors (para debug)
        console.log('\nTest 3b: Listar TODOS los investors (debug)')
        const { data: allInvestors, error: allError } = await supabase
          .from('investors')
          .select('id, full_name, email, user_id')

        if (allError) {
          console.log('❌ Error al listar investors:', allError)
        } else {
          console.log('✅ Investors encontrados:', allInvestors?.length || 0)
          allInvestors?.forEach(inv => {
            console.log(`   - ${inv.full_name} (${inv.email}) - user_id: ${inv.user_id}`)
          })
        }
      } else {
        console.log('✅ Investor encontrado!')
        console.log('   ID:', investorData.id)
        console.log('   Nombre:', investorData.full_name)
        console.log('   Email:', investorData.email)
      }

      // Cerrar sesión
      await supabase.auth.signOut()
    }
  } catch (err) {
    console.log('❌ Excepción durante autenticación:', err.message)
  }

  console.log('\n✨ Pruebas completadas\n')
}

testConnection()
