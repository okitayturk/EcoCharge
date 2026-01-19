import React from 'react';
import { Zap, Wallet, Clock, Leaf } from 'lucide-react';
import { ChargingSession } from '../types';

interface StatsCardsProps {
  sessions: ChargingSession[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ sessions }) => {
  const totalCost = sessions.reduce((acc, s) => acc + s.totalCost, 0);
  const totalKwh = sessions.reduce((acc, s) => acc + s.totalKwh, 0);
  const totalDuration = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  
  // Basit bir CO2 tasarruf hesaplaması (Benzinli araca kıyasla ortalama bir tahmin)
  // 1 kWh elektrik ortalama 0.4-0.5 kg CO2 salınımı anlamına gelebilir, ancak benzinli araç tasarrufu daha yüksektir.
  // Bu sadece motivasyon amaçlı görsel bir veri.
  const co2Saved = (totalKwh * 0.4).toFixed(1); 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Toplam Harcama</p>
          <p className="text-2xl font-bold text-gray-800">₺{totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
          <Zap size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Toplam Enerji</p>
          <p className="text-2xl font-bold text-gray-800">{totalKwh.toFixed(1)} <span className="text-sm font-normal text-gray-400">kWh</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Toplam Süre</p>
          <p className="text-2xl font-bold text-gray-800">
            {Math.floor(totalDuration / 60)}s {totalDuration % 60}dk
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-full">
          <Leaf size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">CO2 Tasarrufu</p>
          <p className="text-2xl font-bold text-gray-800">~{co2Saved} <span className="text-sm font-normal text-gray-400">kg</span></p>
        </div>
      </div>
    </div>
  );
};