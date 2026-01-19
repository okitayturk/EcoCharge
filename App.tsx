import React, { useState, useEffect } from 'react';
import { Zap, Leaf } from 'lucide-react';
import { ChargingSession, FormData } from './types';
import { ChargingForm } from './components/ChargingForm';
import { ChargingHistory } from './components/ChargingHistory';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { db } from './db';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);

  // Uygulama açıldığında veritabanından verileri çek
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await db.sessions.toArray();
        // Tarihe göre yeniden eskiye sırala
        allSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSessions(allSessions);
      } catch (error) {
        console.error("Veritabanından veri çekilemedi:", error);
      }
    };
    loadSessions();
  }, []);

  const handleAddSession = async (data: FormData) => {
    const newSession: ChargingSession = {
      id: crypto.randomUUID(),
      company: data.company,
      date: data.date,
      durationMinutes: parseInt(data.durationMinutes),
      pricePerKwh: parseFloat(data.pricePerKwh),
      totalKwh: parseFloat(data.totalKwh),
      totalCost: parseFloat(data.totalCost),
    };

    try {
      // Veritabanına ekle
      await db.sessions.add(newSession);
      // State'i güncelle (yeni ekleneni en başa koy)
      setSessions(prev => [newSession, ...prev]);
    } catch (error) {
      console.error("Kayıt eklenirken hata:", error);
      alert("Veritabanına kaydedilemedi.");
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      try {
        // Veritabanından sil
        await db.sessions.delete(id);
        // State'i güncelle
        setSessions(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        console.error("Silme işlemi başarısız:", error);
        alert("Kayıt silinemedi.");
      }
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
              <Zap className="text-white" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-green-600">
                EcoCharge
              </h1>
              <p className="text-xs text-emerald-600 font-medium tracking-wide">ELEKTRİKLİ ARAÇ ŞARJ TAKİP</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <Leaf size={16} />
            <span className="text-sm font-semibold">Doğa Dostu Sürüş</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Özet Kartlar */}
        <StatsCards sessions={sessions} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Kolon: Form */}
          <div className="lg:col-span-4 xl:col-span-4">
             <div className="sticky top-28">
               <ChargingForm onAddSession={handleAddSession} />
               
               {/* Bilgi Kartı */}
               <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Leaf size={20} /> Biliyor musunuz?
                  </h4>
                  <p className="text-emerald-50 text-sm leading-relaxed">
                    Elektrikli aracınızı şarj ederek karbon ayak izinizi benzinli araçlara göre ortalama %60 oranında azaltıyorsunuz. Yeşil enerji kullanmaya devam edin!
                  </p>
               </div>
             </div>
          </div>

          {/* Sağ Kolon: Tablo ve Grafikler */}
          <div className="lg:col-span-8 xl:col-span-8">
            <Charts sessions={sessions} />
            <ChargingHistory sessions={sessions} onDelete={handleDeleteSession} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;