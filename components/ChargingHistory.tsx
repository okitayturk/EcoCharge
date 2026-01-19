import React from 'react';
import { Trash2, Calendar, Clock, Zap } from 'lucide-react';
import { ChargingSession } from '../types';

interface ChargingHistoryProps {
  sessions: ChargingSession[];
  onDelete: (id: string) => void;
}

export const ChargingHistory: React.FC<ChargingHistoryProps> = ({ sessions, onDelete }) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-emerald-50">
        <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="text-emerald-300" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Henüz kayıt yok</h3>
        <p className="text-gray-500 mt-1">İlk şarj işleminizi yukarıdaki formdan ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Geçmiş İşlemler</h2>
        <span className="text-sm bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full font-medium">
          {sessions.length} Kayıt
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold rounded-tl-lg">Firma</th>
              <th className="p-4 font-semibold">Tarih</th>
              <th className="p-4 font-semibold">Süre</th>
              <th className="p-4 font-semibold text-right">Enerji</th>
              <th className="p-4 font-semibold text-right">Tutar</th>
              <th className="p-4 font-semibold text-center rounded-tr-lg">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-emerald-50/30 transition-colors">
                <td className="p-4 font-medium text-emerald-900">{session.company}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(session.date).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    {session.durationMinutes} dk
                  </div>
                </td>
                <td className="p-4 text-right font-medium">{session.totalKwh} kWh</td>
                <td className="p-4 text-right font-bold text-gray-900">₺{session.totalCost.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onDelete(session.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};