# Instrucciones para Crear Tabla de Análisis AI

## 📋 Resumen
Esta migración crea la tabla `property_ai_analyses` para almacenar el historial de análisis de IA de propiedades.

## ⚡ Beneficios
- **Ahorro de costos**: No repetir llamadas a la API de Gemini
- **Historial completo**: Ver evolución de análisis en el tiempo
- **Performance**: Carga instantánea de análisis previos
- **Auditoría**: Saber quién analizó qué y cuándo

## 🚀 Instrucciones de Ejecución

### Paso 1: Acceder a Supabase SQL Editor
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: `nsfympzgzdfpiarflshb`
3. Ve a la sección "SQL Editor" en el menú lateral

### Paso 2: Ejecutar el Script
1. Haz clic en "New Query"
2. Copia y pega el contenido del archivo: `lib/supabase/11-create-property-analyses-table.sql`
3. Haz clic en "Run" (o presiona Cmd/Ctrl + Enter)

### Paso 3: Verificar Creación
Al final del script verás una consulta que muestra todas las columnas de la tabla creada.
Deberías ver algo como:

```
table_name               | column_name              | data_type
property_ai_analyses     | id                       | uuid
property_ai_analyses     | property_id              | uuid
property_ai_analyses     | analyzed_by              | uuid
property_ai_analyses     | ai_score                 | integer
property_ai_analyses     | recommendation           | text
property_ai_analyses     | estimated_roi            | numeric
...
```

## ✅ Qué incluye esta migración

1. **Tabla principal**: `property_ai_analyses`
   - Almacena todos los campos del análisis (score, métricas, riesgos, etc.)
   - Usa JSONB para datos complejos (location_data, comparables_data, etc.)

2. **Índices**: Para búsquedas rápidas
   - Por property_id (buscar análisis de una propiedad)
   - Por created_at (ordenar por fecha)
   - Por ai_score (filtrar mejores propiedades)

3. **RLS Policies**: Seguridad automática
   - Admins pueden ver/crear/actualizar/eliminar todos los análisis
   - Inversores pueden ver análisis de propiedades de su fondo

4. **Triggers**: Actualización automática de timestamps

## 🎯 Cómo Funciona Ahora

### Antes (sin persistencia):
1. Usuario abre modal de análisis AI
2. Se llama a Gemini API (10-15 segundos, cuesta dinero)
3. Se muestra análisis
4. Usuario cierra modal
5. **Si vuelve a abrir, se repite todo** 💸

### Ahora (con persistencia):
1. Usuario abre modal de análisis AI
2. **Se busca análisis previo en BD** (instantáneo)
3. Si existe: Se muestra inmediatamente ⚡
4. Si no existe o usuario quiere re-analizar: Se llama a Gemini y se guarda 💾

## 🔄 Flujo Completo

```
┌─────────────────────────┐
│ Usuario abre AI Modal   │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────────┐
    │ ¿Análisis previo?  │
    └────┬──────────┬────┘
         │ SÍ       │ NO
         ▼          ▼
   ┌─────────┐  ┌─────────────┐
   │ Mostrar │  │ Analizar    │
   │ guardado│  │ con Gemini  │
   └────┬────┘  └──────┬──────┘
        │              │
        │              ▼
        │        ┌──────────────┐
        │        │ Guardar en BD│
        │        └──────┬───────┘
        │               │
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │ Mostrar fecha │
        │ + botón       │
        │ "Re-analizar" │
        └───────────────┘
```

## 📊 Datos que se Guardan

Cada análisis incluye:
- **AI Score** (0-100)
- **Recomendación** (COMPRAR/ANALIZAR/RECHAZAR)
- **Métricas financieras**: ROI, apreciación, renta mensual, cap rate
- **Location score**: Proximidad a servicios, desarrollo urbano
- **Riesgos**: Tipo, severidad, descripción
- **Oportunidades**: Lista de ventajas
- **Comparables**: Precio/m² promedio, posición en mercado
- **Precio ideal de compra**: Sugerencia basada en mercado
- **Razonamiento**: Explicación completa del análisis

## 🎨 Nueva UI del Modal

### Cuando hay análisis guardado:
```
┌─────────────────────────────────────────────────────┐
│ 🕐 Análisis guardado del 25 noviembre 2024, 13:45  │
│                              [🔄 Re-analizar]       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ AI Score: 87/100     [COMPRAR]                      │
│ Esta propiedad presenta excelente ubicación...      │
└─────────────────────────────────────────────────────┘

[Métricas, riesgos, oportunidades...]
```

### Sin análisis previo:
```
┌─────────────────────────────────────────────┐
│   🤖 Análisis Inteligente con IA            │
│                                             │
│   Nuestro modelo analizará esta propiedad  │
│   y generará recomendaciones...            │
│                                             │
│   [Analizar con IA]                        │
└─────────────────────────────────────────────┘
```

## 📝 Notas Importantes

1. **No afecta datos existentes**: Esta es una tabla nueva, no modifica nada
2. **Relación con properties**: Usa ON DELETE CASCADE (si borras propiedad, se borran sus análisis)
3. **Usuario que analizó**: Se guarda `analyzed_by` para auditoría
4. **JSONB vs columnas**: Datos complejos en JSONB para flexibilidad

## ⚙️ Configuración Técnica

- **Tabla**: `public.property_ai_analyses`
- **RLS**: Habilitado con políticas basadas en `is_admin()`
- **Timestamps**: Auto-actualizados con trigger
- **Relaciones**: Foreign key a `properties(id)` y `auth.users(id)`

## 🧪 Probar la Funcionalidad

1. Ejecuta el SQL
2. Ve a `/admin/properties` en tu aplicación
3. Haz clic en "AI Analysis" en cualquier propiedad
4. Primera vez: Tomará 10-15 segundos (llama a Gemini)
5. Cierra el modal y vuelve a abrirlo
6. Segunda vez: **Instantáneo** (carga de BD) ⚡
7. Verás la fecha del análisis y botón "Re-analizar"

## 🐛 Troubleshooting

### Si da error "relation already exists":
```sql
DROP TABLE IF EXISTS public.property_ai_analyses CASCADE;
```
Luego ejecuta el script completo de nuevo.

### Si no se guardan los análisis:
Verifica que el usuario admin tenga permiso:
```sql
SELECT is_admin(); -- Debe retornar true
```

### Si no cargan análisis previos:
Verifica que existan:
```sql
SELECT COUNT(*) FROM property_ai_analyses;
```

## 📚 Archivos Relacionados

- **SQL**: `lib/supabase/11-create-property-analyses-table.sql`
- **Server Actions**: `lib/actions/ai-actions.ts`
- **Modal Component**: `components/admin/PropertyAIAnalysisModal.tsx`
- **AI Logic**: `lib/ai/property-analyzer.ts`

---

✅ **Todo listo para ejecutar!** Solo copia el SQL y pégalo en Supabase.
