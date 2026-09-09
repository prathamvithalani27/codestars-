'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export interface AdminChartData {
  title: string;
  fullTitle: string;
  capacity: number;
  registered: number;
}

export default function AdminDashboardChart({ data }: { data: AdminChartData[] }) {
  return (
    <div className="h-96 w-full mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Capacity Utilization per Event</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
          <Tooltip 
            cursor={{fill: '#F3F4F6'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="registered" name="Filled Seats" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey="capacity" name="Total Capacity" fill="#E5E7EB" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
