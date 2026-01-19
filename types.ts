export interface ChargingSession {
  id: string;
  company: string;
  date: string; // ISO string
  durationMinutes: number;
  pricePerKwh: number;
  totalKwh: number;
  totalCost: number;
}

export interface FormData {
  company: string;
  date: string;
  durationMinutes: string;
  pricePerKwh: string;
  totalKwh: string;
  totalCost: string;
}

export const COMPANIES = [
  "ZES",
  "Eşarj",
  "Trugo",
  "Voltrun",
  "Tesla Supercharger",
  "Astor",
  "TRCharge",
  "5Şarj",
  "OtoPriz",
  "RotaWatt",
  "Evde Şarj",
  "Diğer"
];