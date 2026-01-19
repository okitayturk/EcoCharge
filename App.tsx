import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Leaf, Filter, Calendar } from 'lucide-react';
import { ChargingSession, FormData } from './types';
import { ChargingForm } from './components/ChargingForm';
import { ChargingHistory } from './components/ChargingHistory';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { db } from './db';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

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

  // Mevcut kayıtlardan benzersiz ayları çıkar (YYYY-MM formatında)
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    sessions.forEach(s => {
      // s.date formatı "2024-05-20" şeklindedir, ilk 7 karakter "2024-05" verir.
      months.add(s.date.substring(0, 7));
    });
    // Ayları yeniden eskiye sırala
    return Array.from(months).sort().reverse();
  }, [sessions]);

  // Seçili aya göre oturumları filtrele
  const filteredSessions = useMemo(() => {
    if (selectedMonth === 'all') return sessions;
    return sessions.filter(s => s.date.startsWith(selectedMonth));
  }, [sessions, selectedMonth]);

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
      await db.sessions.add(newSession);
      setSessions(prev => {
        const updated = [newSession, ...prev];
        return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    } catch (error) {
      console.error("Kayıt eklenirken hata:", error);
      alert("Veritabanına kaydedilemedi.");
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      try {
        await db.sessions.delete(id);
        setSessions(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        console.error("Silme işlemi başarısız:", error);
        alert("Kayıt silinemedi.");
      }
    }
  };

  // Ay ismini formatla (örn: "2024-05" -> "Mayıs 2024")
  const formatMonthLabel = (dateStr: string) => {
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
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
        
        {/* Filtreleme Alanı */}
        <div className="flex justify-end mb-6">
          <div className="relative inline-flex items-center">
            <div className="absolute left-3 text-emerald-600 pointer-events-none">
              <Filter size={18} />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-white border border-emerald-200 text-emerald-900 py-2.5 pl-10 pr-10 rounded-xl font-medium shadow-sm hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition cursor-pointer"
            >
              <option value="all">Tüm Zamanlar</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{formatMonthLabel(month)}</option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-emerald-600">
              <Calendar size={14} />
            </div>
          </div>
        </div>

        {/* Özet Kartlar (Filtrelenmiş veriyi kullanır) */}
        <StatsCards sessions={filteredSessions} />

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
            {/* Charts'a filtrelenmiş veri ve "Tüm Zamanlar" modunda olup olmadığımızı gönderiyoruz */}
            <Charts 
              sessions={filteredSessions} 
              isAllTime={selectedMonth === 'all'} 
            />
            <ChargingHistory sessions={filteredSessions} onDelete={handleDeleteSession} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;