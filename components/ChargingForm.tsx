import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { COMPANIES, FormData } from '../types';

interface ChargingFormProps {
  onAddSession: (data: FormData) => void;
}

const initialForm: FormData = {
  company: '',
  date: new Date().toISOString().split('T')[0],
  durationMinutes: '',
  pricePerKwh: '',
  totalKwh: '',
  totalCost: '',
};

export const ChargingForm: React.FC<ChargingFormProps> = ({ onAddSession }) => {
  const [formData, setFormData] = useState<FormData>(initialForm);

  // Otomatik hesaplama: kWh veya Birim Fiyat değiştiğinde Toplam Tutarı anında güncelle
  useEffect(() => {
    const kwh = parseFloat(formData.totalKwh);
    const price = parseFloat(formData.pricePerKwh);
    
    // Her iki alan da geçerli bir sayı ise hesapla ve yaz
    if (!isNaN(kwh) && !isNaN(price)) {
       const calculatedCost = (kwh * price).toFixed(2);
       // Sadece değer farklıysa güncelle (gereksiz render önlemek için)
       setFormData(prev => {
         if (prev.totalCost !== calculatedCost) {
           return { ...prev, totalCost: calculatedCost };
         }
         return prev;
       });
    }
  }, [formData.totalKwh, formData.pricePerKwh]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSession(formData);
    setFormData(initialForm);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
        <PlusCircle className="text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-800">Yeni Şarj Kaydı Ekle</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        {/* Firma Seçimi */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Şarj Firması</label>
          <div className="relative">
            <select
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            >
              <option value="" disabled>Seçiniz</option>
              {COMPANIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tarih */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tarih</label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Süre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Süre (Dakika)</label>
          <input
            type="number"
            name="durationMinutes"
            placeholder="Örn: 45"
            required
            min="1"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Birim Fiyat */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Birim Fiyat (₺/kWh)</label>
          <div className="relative">
            <input
              type="number"
              name="pricePerKwh"
              placeholder="0.00"
              required
              step="0.01"
              min="0"
              value={formData.pricePerKwh}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Toplam kWh */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Alınan Enerji (kWh)</label>
          <input
            type="number"
            name="totalKwh"
            placeholder="0.00"
            required
            step="0.1"
            min="0"
            value={formData.totalKwh}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Toplam Tutar */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Toplam Tutar (₺)</label>
          <input
            type="number"
            name="totalCost"
            placeholder="0.00"
            readOnly
            value={formData.totalCost}
            className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed font-bold text-emerald-900"
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};