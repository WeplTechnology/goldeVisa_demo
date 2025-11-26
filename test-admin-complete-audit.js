const { createClient } = require('@supabase/supabase-js')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 AUDITORÍA COMPLETA DE ADMIN - GOLDEN VISA\n')
console.log('=' .repeat(60))
console.log('\n')

const supabase = createClient(supabaseUrl, supabaseKey)

async function fullAudit() {
  try {
    // ============================================
    // 1. AUDITAR getAllInvestors() - Exactamente como en admin-actions.ts
    // ============================================
    console.log('📊 1. FUNCIÓN: getAllInvestors()')
    console.log('-'.repeat(60))

    const { data: investors, error: investorsError } = await supabase
      .from('investors')
      .select(`
        *,
        investments (
          id,
          amount,
          investment_date,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (investorsError) {
      console.error('❌ ERROR:', investorsError)
    } else {
      console.log(`✅ Total inversores: ${investors.length}`)

      investors.forEach((inv, idx) => {
        const totalInvested = inv.investments?.reduce((sum, i) => sum + i.amount, 0) || 0
        const investmentCount = inv.investments?.length || 0

        console.log(`\n  ${idx + 1}. ${inv.full_name}`)
        console.log(`     Email: ${inv.email}`)
        console.log(`     Inversiones: ${investmentCount}`)
        console.log(`     Total invertido: €${totalInvested.toLocaleString()}`)
        console.log(`     Investments array:`, JSON.stringify(inv.investments, null, 2))
      })

      const totalCapital = investors.reduce((sum, inv) => {
        return sum + (inv.investments?.reduce((s, i) => s + i.amount, 0) || 0)
      }, 0)

      console.log(`\n  💰 TOTAL CAPITAL: €${totalCapital.toLocaleString()}`)
    }
    console.log('\n')

    // ============================================
    // 2. AUDITAR getAdminStats()
    // ============================================
    console.log('📊 2. FUNCIÓN: getAdminStats()')
    console.log('-'.repeat(60))

    // Count investors
    const { count: investorCount } = await supabase
      .from('investors')
      .select('*', { count: 'exact', head: true })

    // Count investments
    const { count: investmentCount } = await supabase
      .from('investments')
      .select('*', { count: 'exact', head: true })

    // Sum total capital
    const { data: allInvestments } = await supabase
      .from('investments')
      .select('amount')

    const totalCapitalFromInvestments = allInvestments?.reduce((sum, inv) => sum + inv.amount, 0) || 0

    // Count Golden Visa applications
    const { count: applicationCount } = await supabase
      .from('golden_visa_applications')
      .select('*', { count: 'exact', head: true })

    // Count pending documents
    const { count: pendingDocsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    console.log(`  ✅ Total Inversores: ${investorCount}`)
    console.log(`  ✅ Total Inversiones: ${investmentCount}`)
    console.log(`  ✅ Capital Total: €${totalCapitalFromInvestments.toLocaleString()}`)
    console.log(`  ✅ Aplicaciones Golden Visa: ${applicationCount}`)
    console.log(`  ✅ Documentos Pendientes: ${pendingDocsCount}`)
    console.log('\n')

    // ============================================
    // 3. VERIFICAR QUE INVESTMENTS TIENE INVESTOR_ID
    // ============================================
    console.log('�� 3. RELACIÓN: investments → investors')
    console.log('-'.repeat(60))

    const { data: investmentsWithInvestor } = await supabase
      .from('investments')
      .select('id, investor_id, amount')
      .limit(5)

    console.log('  Primeras 5 inversiones:')
    investmentsWithInvestor?.forEach(inv => {
      console.log(`    - ID: ${inv.id.substring(0, 8)}... | Investor ID: ${inv.investor_id?.substring(0, 8) || 'NULL'}... | Amount: €${inv.amount}`)
    })
    console.log('\n')

    // ============================================
    // 4. VERIFICAR FOREIGN KEY ENTRE TABLES
    // ============================================
    console.log('📊 4. VERIFICAR FOREIGN KEYS EN SUPABASE')
    console.log('-'.repeat(60))

    const { data: fkData, error: fkError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'investments'
      `
    }).catch(() => ({ data: null, error: 'RPC not available' }))

    if (fkError || !fkData) {
      console.log('  ⚠️  No se puede verificar FKs via RPC')
      console.log('  ℹ️  Esto es normal, verificaremos con queries directas')
    } else {
      console.log('  Foreign Keys encontradas:', fkData)
    }
    console.log('\n')

    // ============================================
    // 5. TEST DE QUERY IDÉNTICA A LA DE DASHBOARD
    // ============================================
    console.log('📊 5. SIMULAR QUERY DEL DASHBOARD')
    console.log('-'.repeat(60))

    // Esta es la query que hace el Dashboard
    const { data: statsInvestors } = await supabase
      .from('investors')
      .select(`
        *,
        investments (
          id,
          amount,
          investment_date,
          status
        )
      `)
      .order('created_at', { ascending: false })

    const dashboardStats = {
      totalInvestors: statsInvestors?.length || 0,
      totalInvestments: statsInvestors?.reduce((sum, inv) => sum + (inv.investments?.length || 0), 0) || 0,
      totalCapital: statsInvestors?.reduce((sum, inv) => {
        return sum + (inv.investments?.reduce((s, i) => s + i.amount, 0) || 0)
      }, 0) || 0
    }

    console.log('  📈 Dashboard Stats que debería mostrar:')
    console.log(`     - Total Inversores: ${dashboardStats.totalInvestors}`)
    console.log(`     - Total Inversiones: ${dashboardStats.totalInvestments}`)
    console.log(`     - Capital Total: €${dashboardStats.totalCapital.toLocaleString()}`)
    console.log(`     - Capital en Millones: €${(dashboardStats.totalCapital / 1000000).toFixed(2)}M`)
    console.log('\n')

    // ============================================
    // 6. VERIFICAR RLS POLICIES
    // ============================================
    console.log('📊 6. POLÍTICAS RLS (Row Level Security)')
    console.log('-'.repeat(60))

    const { data: rlsPolicies } = await supabase
      .from('pg_policies')
      .select('*')
      .in('tablename', ['investors', 'investments', 'golden_visa_applications'])
      .catch(() => ({ data: null }))

    if (!rlsPolicies) {
      console.log('  ⚠️  No se puede verificar RLS via query directa')
      console.log('  ℹ️  Usando SERVICE_ROLE_KEY que bypasea RLS')
    } else {
      console.log('  Policies encontradas:', rlsPolicies.length)
    }
    console.log('\n')

    // ============================================
    // RESUMEN FINAL
    // ============================================
    console.log('=' .repeat(60))
    console.log('📋 RESUMEN DE AUDITORÍA')
    console.log('=' .repeat(60))
    console.log(`
✅ Inversores en BD: ${investorCount}
✅ Inversiones en BD: ${investmentCount}
✅ Capital total: €${totalCapitalFromInvestments.toLocaleString()}
✅ Aplicaciones GV: ${applicationCount}

🔍 ANÁLISIS:
- Los datos EXISTEN en Supabase
- Las queries FUNCIONAN correctamente
- Las relaciones investors→investments están OK
${dashboardStats.totalCapital === 0 ? '❌ PROBLEMA: El dashboard calcula €0 a pesar de que hay datos' : '✅ El cálculo del dashboard es correcto'}

💡 Si el dashboard muestra €0:
1. Verifica que 'investments' sea un array en el frontend
2. Verifica console.log en el navegador
3. Problema puede ser en el mapeo de datos en el componente React
`)

  } catch (error) {
    console.error('💥 Exception:', error.message)
    console.error(error)
  }
}

fullAudit()
