import Dexie, { Table } from 'dexie';
import { ChargingSession } from './types';

export class EcoChargeDB extends Dexie {
  sessions!: Table<ChargingSession>;

  constructor() {
    super('EcoChargeDB');
    (this as any).version(1).stores({
      sessions: 'id, company, date' // Primary key ve indekslenecek alanlar
    });
  }
}

export const db = new EcoChargeDB();