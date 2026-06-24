/** Activity dates as ISO strings (YYYY-MM-DD portion used). */
export function computeStreak(activityDates: string[]): number {
  if (activityDates.length === 0) return 0;

  const uniqueDays = [...new Set(activityDates.map((d) => d.slice(0, 10)))].sort();
  if (uniqueDays.length === 0) return 0;

  let streak = 1;
  let best = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      streak += 1;
      best = Math.max(best, streak);
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  return best;
}

export function isStreakActive(activityDates: string[], todayIso: string): boolean {
  if (activityDates.length === 0) return false;
  const today = todayIso.slice(0, 10);
  const days = [...new Set(activityDates.map((d) => d.slice(0, 10)))].sort();
  const last = days[days.length - 1];
  const lastDate = new Date(last);
  const todayDate = new Date(today);
  const diff = Math.round((todayDate.getTime() - lastDate.getTime()) / 86400000);
  return diff <= 1;
}
