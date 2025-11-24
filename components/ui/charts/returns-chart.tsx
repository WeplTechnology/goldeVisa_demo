'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const data = [
  { month: 'Jul', returns: 850, projected: 850 },
  { month: 'Aug', returns: 1720, projected: 1700 },
  { month: 'Sep', returns: 2580, projected: 2550 },
  { month: 'Oct', returns: 3440, projected: 3400 },
  { month: 'Nov', returns: 4300, projected: 4250 },
  { month: 'Dec', returns: 5160, projected: 5100 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-premium-lg border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">{label} 2024</p>
        <p className="text-lg font-bold text-stag-navy">
          €{payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-emerald-600 font-medium">
          +€{(payload[0].value - (payload[1]?.value || 0)).toLocaleString()} vs projected
        </p>
      </div>
    )
  }
  return null
}

export function ReturnsChart() {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6B9BD1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6B9BD1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1B365D" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#1B365D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#E5E7EB" 
            vertical={false}
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="projected"
            stroke="#1B365D"
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorProjected)"
          />
          <Area
            type="monotone"
            dataKey="returns"
            stroke="#6B9BD1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorReturns)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
