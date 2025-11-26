'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#1B365D', '#6B9BD1']

interface InvestmentData {
  realEstateAmount?: number
  rdAmount?: number
}

interface InvestmentPieChartProps {
  data?: InvestmentData
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      percentage: number
    }
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-premium-lg border border-gray-100">
        <p className="text-sm font-semibold text-stag-navy">{payload[0].payload.name}</p>
        <p className="text-lg font-bold text-stag-navy">
          €{payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">{payload[0].payload.percentage}% of portfolio</p>
      </div>
    )
  }
  return null
}

export function InvestmentPieChart({ data: investmentData }: InvestmentPieChartProps) {
  // Default values if no data provided
  const realEstateAmount = investmentData?.realEstateAmount || 212500
  const rdAmount = investmentData?.rdAmount || 37500
  const total = realEstateAmount + rdAmount

  const chartData = [
    {
      name: 'Real Estate',
      value: realEstateAmount,
      percentage: Math.round((realEstateAmount / total) * 100)
    },
    {
      name: 'R&D Investment',
      value: rdAmount,
      percentage: Math.round((rdAmount / total) * 100)
    },
  ]

  return (
    <div className="relative w-full h-[280px] min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-stag-navy">€{(total / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-semibold text-stag-navy">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
