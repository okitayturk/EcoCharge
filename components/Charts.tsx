import React, { useMemo } from 'react';
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
  isAllTime: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export const Charts: React.FC<ChartsProps> = ({ sessions, isAllTime }) => {
  if (sessions.length === 0) return null;

  // 1. Firma bazlı harcama dağılımı (Pie Chart) - Her zaman o anki filtrelenmiş veriyi gösterir
  const pieData = useMemo(() => {
    const map = sessions.reduce((acc, curr) => {
      acc[curr.company] = (acc[curr.company] || 0) + curr.totalCost;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(map).map(key => ({
      name: key,
      value: map[key]
    }));
  }, [sessions]);

  // 2. Bar Chart Verisi Hazırlama
  const barData = useMemo(() => {
    if (isAllTime) {
      // Eğer "Tüm Zamanlar" seçiliyse: Aylara göre grupla ve topla
      const monthlyMap = sessions.reduce((acc, curr) => {
        // curr.date = "2024-05-20" -> key = "2024-05"
        const monthKey = curr.date.substring(0, 7);
        
        if (!acc[monthKey]) {
          acc[monthKey] = { cost: 0, kwh: 0, dateFull: curr.date };
        }
        acc[monthKey].cost += curr.totalCost;
        acc[monthKey].kwh += curr.totalKwh;
        return acc;
      }, {} as Record<string, { cost: number, kwh: number, dateFull: string }>);

      // Map'i array'e çevir ve tarihe göre sırala (Eskiden Yeniye)
      return Object.keys(monthlyMap)
        .sort() // "2024-01", "2024-02" şeklinde string sort yeterli
        .map(key => {
            const dateObj = new Date(key + "-01");
            return {
                name: dateObj.toLocaleDateString('tr-TR', { month: 'long', year: '2-digit' }), // "Mayıs 24"
                cost: monthlyMap[key].cost,
                kwh: monthlyMap[key].kwh,
                fullDate: key // tooltip vb için
            };
        });

    } else {
      // Eğer "Belirli Bir Ay" seçiliyse: O aydaki işlemleri (veya günlük toplamları) göster
      // Burada günlük toplam almak daha temiz görünür.
      
      const dailyMap = sessions.reduce((acc, curr) => {
          const dayKey = curr.date; // "2024-05-20"
          if (!acc[dayKey]) {
              acc[dayKey] = { cost: 0, kwh: 0 };
          }
          acc[dayKey].cost += curr.totalCost;
          acc[dayKey].kwh += curr.totalKwh;
          return acc;
      }, {} as Record<string, {cost: number, kwh: number}>);

      return Object.keys(dailyMap)
        .sort()
        .map(key => {
            const dateObj = new Date(key);
            return {
                name: dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }), // "20 May"
                cost: dailyMap[key].cost,
                kwh: dailyMap[key].kwh
            };
        });
    }
  }, [sessions, isAllTime]);

  const chartTitle = isAllTime ? "Aylara Göre Toplam Harcama (₺)" : "Günlük Harcama (₺)";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Harcama Grafiği */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">{chartTitle}</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                dy={10} 
                interval={0} // Tüm etiketleri göstermeye çalış
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f0fdf4' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [`₺${value.toFixed(2)}`, 'Tutar']}
              />
              <Bar dataKey="cost" fill="#10b981" radius={[6, 6, 0, 0]} barSize={isAllTime ? 40 : 20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Firma Dağılımı */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Firmaya Göre Dağılım {isAllTime ? '(Genel)' : '(Seçili Ay)'}</h3>
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