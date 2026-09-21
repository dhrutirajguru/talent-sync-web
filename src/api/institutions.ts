import { apiRequest } from "@/api/client";

export interface SkillGapItem {
  skill_id: string;
  skill_name: string;
  demand_count: number;
  supply_count: number;
  gap_score: number;
}

export interface SkillGapReportOut {
  institution_id: string;
  institution_name: string;
  total_students: number;
  gaps: SkillGapItem[];
}

export const institutionsApi = {
  getSkillGapReport: (institutionId: string) =>
    apiRequest<SkillGapReportOut>(`/institutions/${institutionId}/skill-gap`, { auth: false }),
};