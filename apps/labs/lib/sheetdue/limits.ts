import type { PlanKey, PlanLimits } from "@workspace/billing";
import { sheetduePlanLimits } from "@workspace/billing";

export type UsageSnapshot = {
  activeSheets: number;
  remindersSent: number;
};

export function canActivateSheet(input: {
  plan: PlanKey;
  usage: UsageSnapshot;
}) {
  const limits = sheetduePlanLimits[input.plan];

  return (
    limits.activeSheets === "unlimited" ||
    input.usage.activeSheets < limits.activeSheets
  );
}

export function activeSheetCountAfterStatusChange(input: {
  activeSheets: number;
  currentStatus?: string | null;
  nextStatus: string;
}) {
  const currentlyActive = input.currentStatus === "active";
  const willBeActive = input.nextStatus === "active";

  if (currentlyActive === willBeActive) {
    return input.activeSheets;
  }

  return input.activeSheets + (willBeActive ? 1 : -1);
}

export function canActivateAfterStatusChange(input: {
  plan: PlanKey;
  activeSheets: number;
  currentStatus?: string | null;
  nextStatus: string;
}) {
  const limits = sheetduePlanLimits[input.plan];
  const nextActiveSheets = activeSheetCountAfterStatusChange(input);

  return limits.activeSheets === "unlimited" || nextActiveSheets <= limits.activeSheets;
}

export function canSendReminder(input: {
  plan: PlanKey;
  usage: UsageSnapshot;
}) {
  return input.usage.remindersSent < sheetduePlanLimits[input.plan].remindersPerMonth;
}

export function getPlanLimits(plan: PlanKey): PlanLimits {
  return sheetduePlanLimits[plan];
}
