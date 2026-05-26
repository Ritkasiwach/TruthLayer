/**
 * In-memory store for reports.
 * In production, replace with a database (e.g., PostgreSQL, Redis).
 */
import type { FactCheckReport } from "@/types";

const reports = new Map<string, FactCheckReport>();

export function getReport(id: string): FactCheckReport | undefined {
  return reports.get(id);
}

export function setReport(id: string, report: FactCheckReport): void {
  reports.set(id, report);
}

export function deleteReport(id: string): boolean {
  return reports.delete(id);
}
