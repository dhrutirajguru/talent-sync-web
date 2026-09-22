import { mockResponse } from "@/api/mockClient";
import mockData from "@/mocks/institutionAnalytics.json";

export interface SkillDistributionItem {
  skill_category: string;
  student_count: number;
}

export interface PlacementTrendItem {
  period: string;
  placements: number;
}

export interface InstitutionAnalyticsOut {
  total_students: number;
  placement_rate: number;
  active_internships: number;
  industry_partners: number;
  skill_distribution: SkillDistributionItem[];
  placement_trends: PlacementTrendItem[];
}

// TODO(real backend): swap for apiRequest<InstitutionAnalyticsOut>(`/institutions/${id}/analytics`),
// backed by the materialized views defined in Section 5.15 of the design doc.
export const institutionAnalyticsApi = {
  get: (): Promise<InstitutionAnalyticsOut> => mockResponse(mockData as InstitutionAnalyticsOut),
};