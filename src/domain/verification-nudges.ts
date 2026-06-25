/** Nudge suppression — avoid spam and repeated prompts */

const NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const SNOOZE_MS = 48 * 60 * 60 * 1000;
const MAX_NUDGES_PER_REPORT_24H = 2;
const MAX_NUDGES_TOTAL_24H = 5;
const FATIGUE_VERIFY_CAP_24H = 6;

export interface NudgeHistoryEntry {
  reportId: string;
  shownAt: string;
  action: 'shown' | 'snoozed' | 'dismissed';
}

export interface NudgeContext {
  history: NudgeHistoryEntry[];
  snoozedUntil: Record<string, string>;
  recentVerifyCount24h: number;
}

function within24h(iso: string, now = Date.now()): boolean {
  return now - new Date(iso).getTime() < NUDGE_COOLDOWN_MS;
}

export function countNudgesForReport(reportId: string, history: NudgeHistoryEntry[]): number {
  return history.filter((h) => h.reportId === reportId && within24h(h.shownAt)).length;
}

export function countRecentNudges(history: NudgeHistoryEntry[]): number {
  return history.filter((h) => within24h(h.shownAt)).length;
}

export function isReportSnoozed(reportId: string, snoozedUntil: Record<string, string>): boolean {
  const until = snoozedUntil[reportId];
  if (!until) return false;
  return new Date(until).getTime() > Date.now();
}

export function shouldSuppressNudge(
  reportId: string,
  ctx: NudgeContext,
): { suppress: boolean; reason?: string } {
  if (isReportSnoozed(reportId, ctx.snoozedUntil)) {
    return { suppress: true, reason: 'Snoozed — we will not remind you about this issue for now' };
  }

  const perReport = countNudgesForReport(reportId, ctx.history);
  if (perReport >= MAX_NUDGES_PER_REPORT_24H) {
    return { suppress: true, reason: 'Already shown recently — no repeat nudge' };
  }

  const total = countRecentNudges(ctx.history);
  if (total >= MAX_NUDGES_TOTAL_24H) {
    return { suppress: true, reason: 'Daily nudge limit reached — check back tomorrow' };
  }

  if (ctx.recentVerifyCount24h >= FATIGUE_VERIFY_CAP_24H) {
    return { suppress: true, reason: 'You have verified plenty today — rest is okay' };
  }

  return { suppress: false };
}

export function snoozeDurationMs(): number {
  return SNOOZE_MS;
}

export { FATIGUE_VERIFY_CAP_24H, MAX_NUDGES_PER_REPORT_24H, MAX_NUDGES_TOTAL_24H };
