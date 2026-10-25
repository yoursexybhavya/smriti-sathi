/**
 * SMRITI SATHI — Medical card
 *
 * The details a stranger needs when they find someone lost: blood group,
 * conditions, medicines, allergies. They are entered by the family, stored on
 * the device, and never invented — an empty card says so plainly.
 */

export interface MedicalCard {
  bloodGroup: string;
  conditions: string[];
  medicines: string[];
  allergies: string[];
}

const KEY = 'smriti_medical_card';
export const MEDICAL_CARD_EVENT = 'smriti-medical-card-changed';

const EMPTY: MedicalCard = { bloodGroup: '', conditions: [], medicines: [], allergies: [] };

function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string' && v.trim() !== '');
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

export const medicalCardService = {
  get(): MedicalCard {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...EMPTY };
      const parsed = JSON.parse(raw) as Partial<MedicalCard>;
      return {
        bloodGroup: typeof parsed.bloodGroup === 'string' ? parsed.bloodGroup : '',
        conditions: toList(parsed.conditions),
        medicines: toList(parsed.medicines),
        allergies: toList(parsed.allergies),
      };
    } catch {
      return { ...EMPTY };
    }
  },

  save(card: MedicalCard): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(card));
      window.dispatchEvent(new Event(MEDICAL_CARD_EVENT));
    } catch {
      /* ignore */
    }
  },

  isEmpty(card: MedicalCard): boolean {
    return !card.bloodGroup && !card.conditions.length && !card.medicines.length && !card.allergies.length;
  },
};
