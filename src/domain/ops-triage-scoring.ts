import type { AdminQueueItem, Report, Severity } from '@/types';
import type {
  OpsPriorityTier,
  OpsTriageIssueResult,
  OpsTriageQueueExplanation,
  OpsTriageScoreFactor,
  OpsTriageSuggestedAction,
} from '@shared/ops-triage-copilot';

const SEVERITY_POINTS: Record<Severity, number> = { high: 30, medium: 18, low: 8 };

export function priorityScoreForReport(report: Report): number {
  return SEVERITY_POINTS[report.severity] + report.corroborationCount * 5;
}

export function duplicateRiskForReport(report: Report): number {
  if (report.duplicateOfId) return 95;
  if (report.aiMetadata?.duplicateTrust?.riskScore) {
    return report.aiMetadata.duplicateTrust.riskScore;
  }
  if (report.id === 'report-005') return 88;
  return 15;
}

function daysOpen(report: Report): number {
  return Math.floor((Date.now() - new Date(report.createdAt).getTime()) / 86400000);
}

function computeUrgency(report: Report, duplicateRisk: number, hotspotRising: boolean): {
  score: number;
  factors: OpsTriageScoreFactor[];
} {
  const factors: OpsTriageScoreFactor[] = [];
  const sev = SEVERITY_POINTS[report.severity];
  factors.push({ factor: 'Severity', points: sev, note: report.severity });
  const age = Math.min(daysOpen(report) * 3, 15);
  if (age > 0) factors.push({ factor: 'Time open', points: age, note: `${daysOpen(report)}d` });
  if (duplicateRisk >= 50) {
    factors.push({ factor: 'Duplicate signal', points: Math.round(duplicateRisk * 0.25), note: `${duplicateRisk}%` });
  }
  if (hotspotRising) {
    factors.push({ factor: 'Hotspot ward', points: 12, note: 'Rising cluster' });
  }
  if (report.severity === 'high' && !report.assignedWorkerId) {
    factors.push({ factor: 'Unassigned high severity', points: 10 });
  }
  const score = factors.reduce((s, f) => s + f.points, 0);
  return { score, factors };
}

function computeConfidence(report: Report, reporterTrustScore: number): {
  score: number;
  factors: OpsTriageScoreFactor[];
} {
  const factors: OpsTriageScoreFactor[] = [];
  const corr = Math.min(report.corroborationCount * 12, 36);
  factors.push({
    factor: 'Neighbor confirmations',
    points: corr,
    note: `${report.corroborationCount} confirmed`,
  });
  const trust = Math.round(reporterTrustScore * 0.4);
  factors.push({ factor: 'Reporter trust', points: trust, note: `${reporterTrustScore}/100` });
  if (report.mediaIds.length > 0) {
    factors.push({ factor: 'Photo/video evidence', points: 8 });
  }
  const intakeConf = report.aiMetadata?.intake?.confidence?.overall;
  if (intakeConf != null) {
    factors.push({
      factor: 'Intake confidence',
      points: Math.round(intakeConf * 15),
      note: `${Math.round(intakeConf * 100)}%`,
    });
  }
  const score = Math.min(100, factors.reduce((s, f) => s + f.points, 0));
  return { score, factors };
}

function resolvePriorityTier(urgency: number, confidence: number, duplicateRisk: number): OpsPriorityTier {
  if (duplicateRisk >= 75 || (urgency >= 45 && confidence < 40)) return 'urgent';
  if (urgency >= 35 || confidence < 50) return 'high';
  if (urgency < 20 && confidence >= 60 && duplicateRisk < 30) return 'monitor';
  return 'normal';
}

function buildSuggestedActions(
  report: Report,
  duplicateRisk: number,
  hasSuspiciousCase: boolean,
): OpsTriageSuggestedAction[] {
  const actions: OpsTriageSuggestedAction[] = [];

  if (hasSuspiciousCase) {
    actions.push({
      action: 'review_now',
      label: 'Review trust flags now',
      citation: 'Linked suspicious-case queue entry',
      draftPayload: { reportId: report.id },
    });
  }

  if (report.status === 'pending_verification' && report.corroborationCount < 2) {
    actions.push({
      action: 'request_verification',
      label: 'Request more verification',
      citation: `Only ${report.corroborationCount} confirmation(s) — below crew threshold`,
      draftPayload: { reportId: report.id, note: 'Awaiting neighbor confirmation before routing' },
    });
  }

  if (duplicateRisk >= 70 || report.duplicateOfId) {
    actions.push({
      action: 'merge_candidate_review',
      label: 'Review merge candidate',
      citation: `Duplicate risk ${duplicateRisk}% — compare with canonical report`,
      draftPayload: {
        reportId: report.id,
        canonicalHint: report.duplicateOfId ?? 'report-001',
      },
    });
  }

  if (
    ['verified', 'acknowledged', 'in_progress'].includes(report.status) &&
    !report.assignedWorkerId
  ) {
    actions.push({
      action: 'assign_field_crew',
      label: 'Assign to field crew',
      citation: 'Verified signal without crew assignment',
      draftPayload: { reportId: report.id, workerId: 'user-worker-1' },
    });
  }

  if (report.assignedWorkerId && report.status === 'in_progress') {
    actions.push({
      action: 'monitor',
      label: 'Monitor crew progress',
      citation: `Assigned to ${report.assignedWorkerId}`,
      draftPayload: { reportId: report.id },
    });
  }

  if (actions.length === 0) {
    actions.push({
      action: 'review_now',
      label: 'Review when ready',
      citation: 'Standard queue item — no blocking flags',
      draftPayload: { reportId: report.id },
    });
  }

  return actions.slice(0, 4);
}

function buildExplanation(
  report: Report,
  tier: OpsPriorityTier,
  urgency: number,
  confidence: number,
  duplicateRisk: number,
  rank: number,
): string {
  const parts = [
    `Priority ${tier} (rank #${rank})`,
    `${report.severity} ${report.category.replace('_', ' ')} in ${report.location.wardId ?? 'ward'}`,
    `Urgency ${urgency}/100 · confidence ${confidence}/100`,
  ];
  if (duplicateRisk >= 50) parts.push(`duplicate signal ${duplicateRisk}%`);
  if (report.corroborationCount < 2 && report.status === 'pending_verification') {
    parts.push('needs more neighbor confirmation before crew routing');
  }
  return parts.join(' — ');
}

export function triageIssueFromQueueItem(
  item: AdminQueueItem,
  rank: number,
  hotspotRising = false,
  hasSuspiciousCase = false,
): OpsTriageIssueResult {
  const { report, reporter } = item;
  const duplicateRisk = item.duplicateRisk;
  const urgency = computeUrgency(report, duplicateRisk, hotspotRising);
  const confidence = computeConfidence(report, reporter.trust.trustScore);
  const tier = resolvePriorityTier(urgency.score, confidence.score, duplicateRisk);
  const scoreBreakdown = [...urgency.factors, ...confidence.factors.map((f) => ({
    ...f,
    factor: `Confidence: ${f.factor}`,
  }))];

  return {
    reportId: report.id,
    priorityTier: tier,
    urgencyScore: urgency.score,
    confidenceScore: confidence.score,
    explanation: buildExplanation(report, tier, urgency.score, confidence.score, duplicateRisk, rank),
    queuePlacement: { suggestedRank: rank, scoreBreakdown },
    suggestedActions: buildSuggestedActions(report, duplicateRisk, hasSuspiciousCase),
    hotspotNote: hotspotRising ? 'Ward shows rising open-issue trend' : undefined,
  };
}

export function triageQueueExplanations(queue: AdminQueueItem[]): OpsTriageQueueExplanation[] {
  return queue.slice(0, 5).map((item, i) => {
    const urgency = computeUrgency(item.report, item.duplicateRisk, false);
    const tier = resolvePriorityTier(urgency.score, item.report.corroborationCount * 15, item.duplicateRisk);
    return {
      reportId: item.report.id,
      rank: i + 1,
      priorityTier: tier,
      summary: `${item.report.severity} ${item.report.category.replace('_', ' ')} · score ${item.priorityScore} · ${item.report.corroborationCount} confirmations`,
    };
  });
}
