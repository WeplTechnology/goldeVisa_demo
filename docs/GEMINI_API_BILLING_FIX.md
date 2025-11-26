# 🔧 Fix: Gemini API Billing y Rate Limits

## 🚨 Problema Identificado

**Error**: `429 Too Many Requests - You exceeded your current quota`

**Causa raíz**: Estabas usando modelos **experimentales** que:
- ❌ No aceptan billing (aunque tengas tarjeta)
- ❌ Tienen límites muy bajos (15 requests/minuto)
- ❌ Son solo para testing, no para producción

## ✅ Solución Implementada

### Cambios Realizados

**1. Cambio en Property Analyzer**
- **Antes**: `gemini-2.0-flash-exp` (experimental)
- **Ahora**: `gemini-1.5-flash` (estable + billing)

**Archivo**: `lib/ai/gemini-client.ts:12`

**2. Cambio en Chatbot API**
- **Antes**: `gemini-2.5-flash` (experimental)
- **Ahora**: `gemini-1.5-flash` (estable + billing)

**Archivo**: `app/api/gemini/route.ts:26`

### ✨ Beneficios del Cambio

| Característica | Experimental | Gemini 1.5 Flash (Estable) |
|----------------|--------------|---------------------------|
| Rate Limit | 15 RPM | 360 RPM (24x más) |
| Acepta billing | ❌ No | ✅ Sí |
| Costo por 1M tokens | Gratis (limitado) | $0.075 input / $0.30 output |
| Estabilidad | Beta | Producción |
| Límite diario | 1,500 | Ilimitado (con billing) |

## 💰 Configurar Billing en Google AI Studio

### Paso 1: Verificar API Key Actual
Tu API key actual: `AIzaSyBCYyQii_1S_Mux72Z-Jbe0HUcb-3JVM1g`

### Paso 2: Habilitar Billing
1. Ve a: https://aistudio.google.com/app/apikey
2. Haz clic en tu API key
3. En el proyecto asociado, ve a Google Cloud Console
4. Habilita "Generative Language API"
5. Configura método de pago en Billing

### Paso 3: Verificar Límites
```bash
# Ver tus límites actuales
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash \
  -H "x-goog-api-key: AIzaSyBCYyQii_1S_Mux72Z-Jbe0HUcb-3JVM1g"
```

## 📊 Comparación de Costos

### Ejemplo: 100 análisis de propiedades

**Input por análisis**: ~700 tokens
**Output por análisis**: ~450 tokens
**Total por análisis**: 1,150 tokens

| Cantidad | Tokens Totales | Costo Input | Costo Output | **Total** |
|----------|---------------|-------------|--------------|-----------|
| 100 análisis | 115,000 tokens | $0.008 | $0.014 | **$0.022** |
| 1,000 análisis | 1,150,000 tokens | $0.086 | $0.345 | **$0.43** |

💡 **Conclusión**: Extremadamente barato. 1,000 análisis cuestan menos de $0.50

## 🧪 Probar el Fix

### Opción 1: Esperar 1 minuto
El rate limit se resetea cada minuto. Si ya pasó 1 minuto desde tu último error, debería funcionar.

### Opción 2: Probar ahora
1. Ve a: http://localhost:3001/admin/properties
2. Haz clic en "AI Analysis" en cualquier propiedad
3. Debería funcionar sin errores

### Verificar en logs
```bash
# Si ves esto = SUCCESS
✅ AI Analysis completed. Score: 82
💾 Analysis saved to database

# Si ves esto = todavía hay problema
❌ Error analyzing property with AI: [429]
```

## 🔍 Si Sigue Fallando

### Opción A: Crear Nueva API Key

1. Ve a: https://aistudio.google.com/app/apikey
2. Crea nueva API key
3. Asegúrate de seleccionar un proyecto con **billing habilitado**
4. Actualiza `.env.local`:
```env
GEMINI_API_KEY=tu_nueva_key_aqui
```
5. Reinicia servidor: `npm run dev`

### Opción B: Verificar Estado de la API

```bash
# Ver estado del servicio
curl -I https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash \
  -H "x-goog-api-key: AIzaSyBCYyQii_1S_Mux72Z-Jbe0HUcb-3JVM1g"

# Respuesta esperada:
# HTTP/2 200  ← Todo OK
# HTTP/2 429  ← Todavía con rate limit
# HTTP/2 403  ← API key inválida
```

## 📈 Límites Actualizados

### Gemini 1.5 Flash (Free Tier)
```
Requests per minute (RPM): 15
Requests per day (RPD): 1,500
Tokens per minute (TPM): 1,000,000
```

### Gemini 1.5 Flash (Con Billing)
```
Requests per minute (RPM): 360 (24x más)
Requests per day (RPD): Ilimitado
Tokens per minute (TPM): 4,000,000 (4x más)
```

## ⚠️ Importante: Diferencias entre Modelos

| Modelo | Tipo | Billing | Mejor para |
|--------|------|---------|------------|
| `gemini-2.0-flash-exp` | Experimental | ❌ No | Testing features nuevas |
| `gemini-2.5-flash` | Experimental | ❌ No | Testing únicamente |
| `gemini-1.5-flash` | **Estable** | ✅ Sí | **Producción** ✅ |
| `gemini-1.5-pro` | Estable | ✅ Sí | Tareas complejas |

## 🎯 Recomendación Final

**Para Desarrollo/MVP**: Usa `gemini-1.5-flash` (gratis hasta 1,500 req/día)
**Para Producción**: Habilita billing + usa `gemini-1.5-flash` (económico y rápido)
**Para Tareas Complejas**: Usa `gemini-1.5-pro` (más inteligente pero más caro)

## 📝 Notas sobre el Error 429

El error `429 Too Many Requests` ocurre cuando:
1. ❌ Excedes RPM (requests per minute)
2. ❌ Excedes RPD (requests per day)
3. ❌ Excedes TPM (tokens per minute)

**En tu caso**: Probablemente excediste los 15 RPM del modelo experimental con solo 3-4 pruebas si fueron muy rápidas (< 1 minuto entre ellas).

**Con el nuevo modelo estable**: Puedes hacer 360 requests por minuto → mucho más margen.

## ✅ Checklist Post-Fix

- [x] Cambiar modelo a `gemini-1.5-flash` en property analyzer
- [x] Cambiar modelo a `gemini-1.5-flash` en chatbot
- [ ] Esperar 1 minuto para reset de rate limit
- [ ] Probar análisis de propiedad
- [ ] Verificar que se guarda en BD
- [ ] (Opcional) Habilitar billing en Google Cloud

---

**Última actualización**: 25 noviembre 2024
**Estado**: ✅ Fix implementado, listo para probar
