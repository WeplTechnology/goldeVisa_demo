'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, AlertTriangle, Lightbulb, MapPin, DollarSign, Home, X, Clock, RefreshCw, Download } from 'lucide-react'
import { analyzePropertyWithAI, getLatestPropertyAnalysis } from '@/lib/actions/ai-actions'
import type { PropertyAnalysis } from '@/lib/ai/property-analyzer'
import { generatePropertyReport } from '@/lib/pdf/property-report-generator'

interface PropertyAIAnalysisModalProps {
  property: {
    id: string
    name: string
    address: string
    city: string
    country: string
    acquisition_price: number
    current_value: number
    total_size_sqm: number
    total_units: number
    status: string
  }
  isOpen: boolean
  onClose: () => void
}

export function PropertyAIAnalysisModal({ property, isOpen, onClose }: PropertyAIAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<(PropertyAnalysis & { created_at?: string }) | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingPrevious, setLoadingPrevious] = useState(true)

  // Cargar análisis previo si existe
  useEffect(() => {
    if (isOpen && property.id) {
      loadPreviousAnalysis()
    }
  }, [isOpen, property.id])

  const loadPreviousAnalysis = async () => {
    setLoadingPrevious(true)
    try {
      const result = await getLatestPropertyAnalysis(property.id)
      if (result.success && result.analysis) {
        setAnalysis(result.analysis)
      }
    } catch (err) {
      console.error('Error loading previous analysis:', err)
    } finally {
      setLoadingPrevious(false)
    }
  }

  const handleAnalyze = async (forceNew = false) => {
    setLoading(true)
    setError(null)

    try {
      const result = await analyzePropertyWithAI(property)

      if (result.success && result.analysis) {
        setAnalysis(result.analysis)
      } else {
        setError(result.error || 'Error al analizar la propiedad')
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const getRecommendationColor = (rec: string) => {
    if (rec === 'COMPRAR') return 'bg-emerald-100 text-emerald-700'
    if (rec === 'ANALIZAR') return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 text-red-700'
    if (severity === 'medium') return 'bg-amber-100 text-amber-700'
    return 'bg-blue-100 text-blue-700'
  }

  const handleDownloadReport = () => {
    if (!analysis) return

    try {
      generatePropertyReport(property, analysis, true)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar el reporte PDF. Por favor intenta de nuevo.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-stag-navy">
              🤖 AI Investment Analysis
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm text-gray-500 mt-2">
            {property.name}, {property.city}
          </DialogDescription>
        </DialogHeader>

        {loadingPrevious && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-stag-blue mx-auto mb-4" />
            <p className="text-gray-600">Buscando análisis previos...</p>
          </div>
        )}

        {!analysis && !loading && !error && !loadingPrevious && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-stag-navy mb-2">
              Análisis Inteligente con IA
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nuestro modelo de IA analizará esta propiedad y generará recomendaciones de inversión basadas en datos del mercado italiano.
            </p>
            <Button
              onClick={handleAnalyze}
              className="bg-stag-blue hover:bg-stag-navy"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analizar con IA
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-stag-blue mx-auto mb-4" />
            <p className="text-gray-600">Analizando propiedad con IA...</p>
            <p className="text-sm text-gray-500 mt-2">Esto puede tardar 10-15 segundos</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-2">Error en el análisis</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button onClick={handleAnalyze} variant="outline">
              Reintentar
            </Button>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Header con fecha y botón re-analizar */}
            {analysis.created_at && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span>
                    Análisis guardado del {new Date(analysis.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <Button
                  onClick={() => handleAnalyze(true)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Re-analizar
                </Button>
              </div>
            )}

            {/* AI Score y Recomendación */}
            <div className="bg-gradient-to-br from-stag-light to-white p-6 rounded-xl border-2 border-stag-blue/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">AI Score</h3>
                  <p className={`text-4xl font-bold ${getScoreColor(analysis.aiScore)}`}>
                    {analysis.aiScore}/100
                  </p>
                </div>
                <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(analysis.recommendation)}`}>
                  {analysis.recommendation}
                </Badge>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {analysis.reasoning}
              </p>
            </div>

            {/* Métricas Financieras */}
            <div>
              <h3 className="text-lg font-bold text-stag-navy mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Métricas Financieras (5 años)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">ROI Estimado</p>
                  <p className="text-2xl font-bold text-stag-navy">
                    {analysis.financialMetrics.estimatedROI.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Apreciación</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    +{analysis.financialMetrics.estimatedAppreciation}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Renta Mensual</p>
                  <p className="text-2xl font-bold text-blue-600">
                    €{analysis.financialMetrics.estimatedRentalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Cap Rate</p>
                  <p className="text-2xl font-bold text-stag-navy">
                    {analysis.financialMetrics.capRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Location Score */}
            <div>
              <h3 className="text-lg font-bold text-stag-navy mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Score: {analysis.locationScore.score}/100
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Metro</p>
                    <p className="font-medium">{analysis.locationScore.proximity.metro}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Colegios</p>
                    <p className="font-medium">{analysis.locationScore.proximity.schools}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Comercios</p>
                    <p className="font-medium">{analysis.locationScore.proximity.shopping}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Desarrollo urbano</p>
                  <p className="text-sm">{analysis.locationScore.development}</p>
                </div>
              </div>
            </div>

            {/* Comparables */}
            <div>
              <h3 className="text-lg font-bold text-stag-navy mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Análisis Comparativo
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Precio promedio zona</p>
                    <p className="text-xl font-bold text-gray-800">
                      €{analysis.comparables.averagePricePerSqm.toLocaleString()}/m²
                    </p>
                  </div>
                  <Badge className={
                    analysis.comparables.pricePosition === 'below'
                      ? 'bg-emerald-100 text-emerald-700'
                      : analysis.comparables.pricePosition === 'at'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }>
                    {analysis.comparables.percentageDifference > 0 ? '+' : ''}
                    {analysis.comparables.percentageDifference}% vs mercado
                  </Badge>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">💡 Precio ideal de compra</p>
                  <p className="text-2xl font-bold text-stag-blue">
                    €{analysis.idealPurchasePrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((1 - analysis.idealPurchasePrice / property.current_value) * 100).toFixed(1)}% bajo precio actual
                  </p>
                </div>
              </div>
            </div>

            {/* Riesgos */}
            {analysis.risks.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-stag-navy mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Riesgos Identificados
                </h3>
                <div className="space-y-2">
                  {analysis.risks.map((risk, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 flex items-start gap-3">
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity === 'high' ? 'Alto' : risk.severity === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-1">{risk.type}</p>
                        <p className="text-sm text-gray-600">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Oportunidades */}
            {analysis.opportunities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-stag-navy mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Oportunidades
                </h3>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <ul className="space-y-2">
                    {analysis.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span className="text-sm text-gray-700">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="flex-1 gap-2 border-stag-blue text-stag-blue hover:bg-stag-light"
              >
                <Download className="w-4 h-4" />
                Descargar Reporte PDF
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-stag-blue hover:bg-stag-navy"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
