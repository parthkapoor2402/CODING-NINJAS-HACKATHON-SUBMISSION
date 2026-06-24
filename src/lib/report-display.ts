import type { Report } from '@/types';
import { categoryLabel } from '@/utils/labels';

/** Human-readable label for duplicate nudges and review — never raw report IDs in UI. */
export function reportDisplayName(
  report: Pick<Report, 'category' | 'location' | 'description'>,
): string {
  const place = report.location.address?.trim();
  const cat = categoryLabel(report.category);
  if (place) return `${cat} at ${place}`;
  return cat;
}

export function reportShortSummary(description: string, maxLen = 72): string {
  const trimmed = description.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1)}…`;
}
