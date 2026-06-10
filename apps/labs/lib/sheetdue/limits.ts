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

export function canSendReminder(input: {
  plan: PlanKey;
  usage: UsageSnapshot;
}) {
  return input.usage.remindersSent < sheetduePlanLimits[input.plan].remindersPerMonth;
}

export function getPlanLimits(plan: PlanKey): PlanLimits {
  return sheetduePlanLimits[plan];
}
