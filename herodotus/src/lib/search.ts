import { Monument } from '../types/monument';

/**
 * Normalizes a string for diacritic-insensitive, punctuation-resilient search.
 * Converts to lowercase, strips combining diacritical marks (e.g., accents),
 * and removes apostrophes and quotes.
 */
export function normalizeSearchString(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Strip combining diacritical accents
    .replace(/['’`]/g, '')           // Strip apostrophes and backticks
    .toLowerCase()
    .trim();
}

/**
 * Searches a list of monuments using a multi-field, diacritic-insensitive,
 * tokenized fuzzy matching algorithm.
 * 
 * Matches across:
 * - English name (`name`)
 * - Hindi Devanagari name (`hindiName`)
 * - Alternate / historic aliases (`alternateNames`)
 * - Location (`city`, `state`, `district`, `asiCircle`)
 * - Historical classification (`dynasty`, `era`)
 * - Architectural category (`category`)
 * - UNESCO status if query mentions 'unesco'
 */
export function searchMonuments(monuments: Monument[], rawQuery: string): Monument[] {
  if (!rawQuery || !rawQuery.trim()) {
    return monuments;
  }

  const trimmedQuery = rawQuery.trim();
  const normalizedQuery = normalizeSearchString(trimmedQuery);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return monuments.filter((m) => {
    // 1. Direct Devanagari / Unicode substring check against Hindi name & aliases
    if (m.hindiName && m.hindiName.includes(trimmedQuery)) {
      return true;
    }

    // 2. Prepare normalized target strings
    const searchableTargets: string[] = [
      normalizeSearchString(m.name),
      normalizeSearchString(m.city),
      normalizeSearchString(m.state),
      normalizeSearchString(m.district),
      normalizeSearchString(m.asiCircle),
      normalizeSearchString(m.dynasty),
      normalizeSearchString(m.era),
      normalizeSearchString(m.category),
      ...m.alternateNames.map(normalizeSearchString),
    ];

    if (m.unesco) {
      searchableTargets.push('unesco', 'world heritage');
      if (m.unescoSiteName) {
        searchableTargets.push(normalizeSearchString(m.unescoSiteName));
      }
    }

    // 3. Multi-token match: Every token must match at least one of the searchable targets
    return tokens.every((token) =>
      searchableTargets.some((target) => target.includes(token))
    );
  });
}
