import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ChargingSession } from '../types';

interface ChartsProps {
  sessions: ChargingSession[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export const Charts: React.FC<ChartsProps> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  // Firma bazlı harcama dağılımı verisi
  const companyDataMap = sessions.reduce((acc, curr) => {
    acc[curr.company] = (acc[curr.company] || 0) + curr.totalCost;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(companyDataMap).map(key => ({
    name: key,
    value: companyDataMap[key]
  }));

  // Son 7 oturumun grafiği (kronolojik sıra)
  // Recharts için veriyi ters çevirmeden (eskiden yeniye) sıralamalıyız
  const sortedSessions = [...sessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Son 7

  const barData = sortedSessions.map(s => ({
    date: new Date(s.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    cost: s.totalCost,
    kwh: s.totalKwh
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Harcama Grafiği */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Son Harcamalar (₺)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f0fdf4' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="cost" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Firma Dağılımı */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Firmaya Göre Toplam Tutar</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} formatter={(value: number) => `₺${value.toFixed(2)}`} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};