/**
 * Generador de reportes PDF profesionales para análisis de propiedades
 * STAG Fund Management - Golden Visa Platform
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { PropertyAnalysis } from '@/lib/ai/property-analyzer'

interface PropertyData {
  id: string
  name: string
  address: string
  city: string
  country: string
  acquisition_price: number
  current_value: number
  total_size_sqm: number | null
  total_units: number
  status: string
}

// Colores de marca STAG
const COLORS = {
  primary: [17, 38, 93] as const, // Navy
  secondary: [41, 128, 185] as const, // Blue
  accent: [255, 193, 7] as const, // Gold
  success: [16, 185, 129] as const, // Emerald
  warning: [251, 146, 60] as const, // Amber
  danger: [239, 68, 68] as const, // Red
  text: [55, 65, 81] as const, // Gray-700
  lightGray: [243, 244, 246] as const, // Gray-100
  white: [255, 255, 255] as const
} as const

export class PropertyReportGenerator {
  private doc: jsPDF
  private currentY: number = 20
  private pageWidth: number
  private pageHeight: number
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
  }

  /**
   * Generar reporte completo de propiedad con análisis AI
   */
  public generate(property: PropertyData, analysis: PropertyAnalysis): void {
    // Página 1: Portada
    this.addCoverPage(property, analysis)

    // Página 2: Resumen Ejecutivo
    this.doc.addPage()
    this.currentY = 20
    this.addExecutiveSummary(property, analysis)

    // Página 3: Análisis Financiero
    this.doc.addPage()
    this.currentY = 20
    this.addFinancialAnalysis(property, analysis)

    // Página 4: Análisis de Ubicación y Mercado
    this.doc.addPage()
    this.currentY = 20
    this.addLocationAndMarketAnalysis(property, analysis)

    // Página 5: Riesgos y Oportunidades
    this.doc.addPage()
    this.currentY = 20
    this.addRisksAndOpportunities(analysis)

    // Última página: Información de Contacto
    this.addFooterToAllPages()
  }

  /**
   * Descargar el PDF generado
   */
  public download(filename: string): void {
    this.doc.save(filename)
  }

  /**
   * Obtener el PDF como blob
   */
  public getBlob(): Blob {
    return this.doc.output('blob')
  }

  // ========================================
  // PÁGINAS DEL REPORTE
  // ========================================

  /**
   * Página 1: Portada
   */
  private addCoverPage(property: PropertyData, analysis: PropertyAnalysis): void {
    const centerX = this.pageWidth / 2

    // Background header
    this.doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
    this.doc.rect(0, 0, this.pageWidth, 80, 'F')

    // Logo / Título STAG
    this.doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2])
    this.doc.setFontSize(32)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('STAG', centerX, 35, { align: 'center' })

    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('FUND MANAGEMENT', centerX, 45, { align: 'center' })

    this.doc.setFontSize(12)
    this.doc.text('Golden Visa Investment Report', centerX, 55, { align: 'center' })

    // Tipo de documento
    this.doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2])
    this.doc.rect(this.margin, 90, this.pageWidth - 2 * this.margin, 1, 'F')

    // Nombre de la propiedad
    this.doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2])
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    const propertyName = this.wrapText(property.name, this.pageWidth - 2 * this.margin)
    this.doc.text(propertyName, centerX, 110, { align: 'center' })

    // Ubicación
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`${property.city}, ${property.country}`, centerX, 125, { align: 'center' })

    // AI Score Badge
    const scoreColor: readonly [number, number, number] = analysis.aiScore >= 85 ? COLORS.success :
                       analysis.aiScore >= 70 ? COLORS.secondary :
                       analysis.aiScore >= 50 ? COLORS.warning : COLORS.danger

    this.doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2])
    this.doc.roundedRect(centerX - 30, 140, 60, 25, 3, 3, 'F')

    this.doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2])
    this.doc.setFontSize(28)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`${analysis.aiScore}`, centerX, 153, { align: 'center' })

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('AI SCORE', centerX, 161, { align: 'center' })

    // Recomendación
    const recColor: readonly [number, number, number] = analysis.recommendation === 'COMPRAR' ? COLORS.success :
                     analysis.recommendation === 'ANALIZAR' ? COLORS.warning : COLORS.danger

    this.doc.setFillColor(recColor[0], recColor[1], recColor[2])
    this.doc.roundedRect(centerX - 25, 175, 50, 12, 2, 2, 'F')

    this.doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2])
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(analysis.recommendation, centerX, 183, { align: 'center' })

    // Información básica
    this.doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2])
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')

    const sizeDisplay = property.total_size_sqm ?? 100
    const pricePerSqm = property.total_size_sqm
      ? (property.current_value / property.total_size_sqm).toFixed(0)
      : 'N/A'

    const basicInfo = [
      `Valor actual: €${property.current_value.toLocaleString()}`,
      `Superficie: ${sizeDisplay} m²`,
      `Unidades: ${property.total_units}`,
      `Precio/m²: €${pricePerSqm}/m²`
    ]

    let infoY = 210
    basicInfo.forEach(info => {
      this.doc.text(info, centerX, infoY, { align: 'center' })
      infoY += 8
    })

    // Fecha del reporte
    this.doc.setFontSize(9)
    this.doc.setTextColor(120, 120, 120)
    const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    this.doc.text(`Reporte generado: ${date}`, centerX, this.pageHeight - 15, { align: 'center' })
  }

  /**
   * Página 2: Resumen Ejecutivo
   */
  private addExecutiveSummary(property: PropertyData, analysis: PropertyAnalysis): void {
    this.addSectionTitle('RESUMEN EJECUTIVO')

    // Razonamiento del análisis
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2])

    const reasoning = this.wrapText(analysis.reasoning, this.pageWidth - 2 * this.margin)
    const lines = this.doc.splitTextToSize(reasoning, this.pageWidth - 2 * this.margin)
    lines.forEach((line: string) => {
      this.checkPageBreak()
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += 6
    })

    this.currentY += 5

    // Tabla de información de la propiedad
    this.addSubsectionTitle('Información de la Propiedad')

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Campo', 'Valor']],
      body: [
        ['Nombre', property.name],
        ['Dirección', property.address],
        ['Ciudad', `${property.city}, ${property.country}`],
        ['Valor Actual', `€${property.current_value.toLocaleString()}`],
        ['Precio de Adquisición', `€${property.acquisition_price.toLocaleString()}`],
        ['Superficie Total', `${property.total_size_sqm ?? 100} m²`],
        ['Número de Unidades', property.total_units.toString()],
        ['Precio por m²', property.total_size_sqm ? `€${(property.current_value / property.total_size_sqm).toFixed(0)}` : 'N/A'],
        ['Estado', property.status]
      ],
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary as [number, number, number],
        textColor: COLORS.white as [number, number, number],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray as [number, number, number]
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = (data.cursor?.y || this.currentY) + 10
      }
    })
  }

  /**
   * Página 3: Análisis Financiero
   */
  private addFinancialAnalysis(property: PropertyData, analysis: PropertyAnalysis): void {
    this.addSectionTitle('ANÁLISIS FINANCIERO')

    // Métricas clave
    this.addSubsectionTitle('Métricas de Inversión (Proyección 5 años)')

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Métrica', 'Valor', 'Comentario']],
      body: [
        [
          'ROI Estimado',
          `${analysis.financialMetrics.estimatedROI.toFixed(1)}%`,
          'Retorno sobre inversión'
        ],
        [
          'Apreciación Estimada',
          `${analysis.financialMetrics.estimatedAppreciation.toFixed(1)}%`,
          'Valorización del activo'
        ],
        [
          'Ingresos por Renta',
          `€${analysis.financialMetrics.estimatedRentalIncome.toLocaleString()}/mes`,
          'Ingreso mensual estimado'
        ],
        [
          'Cap Rate',
          `${analysis.financialMetrics.capRate.toFixed(2)}%`,
          'Tasa de capitalización'
        ],
        [
          'Ingresos Anuales',
          `€${(analysis.financialMetrics.estimatedRentalIncome * 12).toLocaleString()}`,
          'Renta anual total'
        ]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.secondary as [number, number, number],
        textColor: COLORS.white as [number, number, number]
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = (data.cursor?.y || this.currentY) + 10
      }
    })

    this.checkPageBreak(60)

    // Comparación con el mercado
    this.addSubsectionTitle('Comparación con el Mercado')

    const pricePosition = analysis.comparables.pricePosition === 'below' ? 'Por debajo del mercado' :
                          analysis.comparables.pricePosition === 'at' ? 'En línea con el mercado' :
                          'Por encima del mercado'

    const positionColor: readonly [number, number, number] = analysis.comparables.pricePosition === 'below' ? COLORS.success :
                          analysis.comparables.pricePosition === 'at' ? COLORS.secondary :
                          COLORS.warning

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Indicador', 'Valor']],
      body: [
        ['Precio promedio zona', `€${analysis.comparables.averagePricePerSqm.toLocaleString()}/m²`],
        ['Precio esta propiedad', property.total_size_sqm ? `€${(property.current_value / property.total_size_sqm).toFixed(0)}/m²` : 'N/A'],
        ['Diferencia', `${analysis.comparables.percentageDifference > 0 ? '+' : ''}${analysis.comparables.percentageDifference}%`],
        ['Posición', pricePosition],
        ['Precio ideal de compra', `€${analysis.idealPurchasePrice.toLocaleString()}`],
        ['Descuento sugerido', `${((1 - analysis.idealPurchasePrice / property.current_value) * 100).toFixed(1)}%`]
      ],
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.secondary as [number, number, number],
        textColor: COLORS.white as [number, number, number]
      },
      bodyStyles: {
        textColor: COLORS.text as [number, number, number]
      },
      didDrawCell: (data) => {
        if (data.row.index === 3 && data.column.index === 1) {
          // Colorear la celda de posición
          this.doc.setFillColor(positionColor[0], positionColor[1], positionColor[2])
          this.doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F')
          this.doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2])
          this.doc.text(pricePosition, data.cell.x + 2, data.cell.y + 5)
        }
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = (data.cursor?.y || this.currentY) + 10
      }
    })
  }

  /**
   * Página 4: Análisis de Ubicación y Mercado
   */
  private addLocationAndMarketAnalysis(property: PropertyData, analysis: PropertyAnalysis): void {
    this.addSectionTitle('ANÁLISIS DE UBICACIÓN')

    // Score de ubicación
    this.addSubsectionTitle(`Location Score: ${analysis.locationScore.score}/100`)

    this.doc.setFontSize(10)
    this.doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2])
    this.doc.text(analysis.locationScore.development, this.margin, this.currentY)
    this.currentY += 10

    // Proximidad a servicios
    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Servicio', 'Distancia']],
      body: [
        ['Metro / Transporte', analysis.locationScore.proximity.metro],
        ['Colegios / Educación', analysis.locationScore.proximity.schools],
        ['Comercios / Servicios', analysis.locationScore.proximity.shopping]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.secondary as [number, number, number],
        textColor: COLORS.white as [number, number, number]
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = (data.cursor?.y || this.currentY) + 15
      }
    })
  }

  /**
   * Página 5: Riesgos y Oportunidades
   */
  private addRisksAndOpportunities(analysis: PropertyAnalysis): void {
    this.addSectionTitle('RIESGOS Y OPORTUNIDADES')

    // Riesgos
    if (analysis.risks.length > 0) {
      this.addSubsectionTitle('Riesgos Identificados')

      const risksData = analysis.risks.map(risk => [
        risk.type,
        risk.severity === 'high' ? 'Alto' : risk.severity === 'medium' ? 'Medio' : 'Bajo',
        risk.description
      ])

      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Tipo', 'Severidad', 'Descripción']],
        body: risksData,
        theme: 'striped',
        headStyles: {
          fillColor: COLORS.danger as [number, number, number],
          textColor: COLORS.white as [number, number, number]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 25 },
          2: { cellWidth: 'auto' }
        },
        didDrawCell: (data) => {
          if (data.column.index === 1 && data.row.section === 'body') {
            const severity = analysis.risks[data.row.index].severity
            const color: readonly [number, number, number] = severity === 'high' ? COLORS.danger :
                         severity === 'medium' ? COLORS.warning : COLORS.secondary
            this.doc.setFillColor(color[0], color[1], color[2])
            this.doc.roundedRect(data.cell.x + 2, data.cell.y + 2, data.cell.width - 4, data.cell.height - 4, 1, 1, 'F')
            this.doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2])
            this.doc.setFontSize(9)
            const text = severity === 'high' ? 'Alto' : severity === 'medium' ? 'Medio' : 'Bajo'
            this.doc.text(text, data.cell.x + data.cell.width / 2, data.cell.y + 5, { align: 'center' })
          }
        },
        margin: { left: this.margin, right: this.margin },
        didDrawPage: (data) => {
          this.currentY = (data.cursor?.y || this.currentY) + 15
        }
      })
    }

    this.checkPageBreak(80)

    // Oportunidades
    if (analysis.opportunities.length > 0) {
      this.addSubsectionTitle('Oportunidades de Inversión')

      this.doc.setFontSize(10)
      this.doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2])

      analysis.opportunities.forEach((opp, index) => {
        this.checkPageBreak()

        // Bullet point
        this.doc.setFillColor(COLORS.success[0], COLORS.success[1], COLORS.success[2])
        this.doc.circle(this.margin + 2, this.currentY - 1.5, 1.5, 'F')

        // Texto de la oportunidad
        const wrapped = this.doc.splitTextToSize(opp, this.pageWidth - this.margin * 2 - 8)
        this.doc.text(wrapped, this.margin + 6, this.currentY)
        this.currentY += wrapped.length * 5 + 3
      })
    }
  }

  // ========================================
  // UTILIDADES
  // ========================================

  private addSectionTitle(title: string): void {
    this.checkPageBreak(20)

    this.doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 10, 'F')

    this.doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2])
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin + 3, this.currentY + 1)

    this.currentY += 15
  }

  private addSubsectionTitle(title: string): void {
    this.checkPageBreak(15)

    this.doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2])
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin, this.currentY)

    this.currentY += 8
  }

  private checkPageBreak(requiredSpace: number = 30): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage()
      this.currentY = 20
    }
  }

  private wrapText(text: string, maxWidth: number): string {
    return text.length > maxWidth / 2 ? text.substring(0, maxWidth / 2) + '...' : text
  }

  private addFooterToAllPages(): void {
    const pageCount = (this.doc as any).getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {
      (this.doc as any).setPage(i)

      // Línea divisoria
      this.doc.setDrawColor(COLORS.lightGray[0], COLORS.lightGray[1], COLORS.lightGray[2])
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15)

      // Texto del footer
      this.doc.setFontSize(8)
      this.doc.setTextColor(120, 120, 120)
      this.doc.text('STAG Fund Management | Golden Visa Investment Platform', this.margin, this.pageHeight - 10)
      this.doc.text(`Página ${i} de ${pageCount}`, this.pageWidth - this.margin, this.pageHeight - 10, { align: 'right' })
    }
  }
}

/**
 * Función helper para generar y descargar reporte
 */
export function generatePropertyReport(
  property: PropertyData,
  analysis: PropertyAnalysis,
  download: boolean = true
): PropertyReportGenerator | Blob {
  const generator = new PropertyReportGenerator()
  generator.generate(property, analysis)

  if (download) {
    const filename = `STAG_Property_Report_${property.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    generator.download(filename)
    return generator
  } else {
    return generator.getBlob()
  }
}
