import { apiRequest } from "@/api/client";
import type { OpportunityMatchOut, OpportunityOut, CandidateMatchOut } from "@/types/domain";

export interface OpportunitySkillInput {
  skill_id: string;
  required_level?: string;
  importance?: string;
  required?: boolean;
}

export interface OpportunityCreateInput {
  title: string;
  opportunity_type: string;
  description: string;
  department?: string;
  location?: string;
  work_mode?: string;
  duration_text?: string;
  stipend_amount?: number;
  application_deadline?: string;
  start_date?: string;
  end_date?: string;
  eligibility_criteria?: string;
  min_cgpa?: number;
  openings_count?: number;
  required_skills: OpportunitySkillInput[];
}

export const opportunitiesApi = {
  listRecommended: () => apiRequest<OpportunityMatchOut[]>("/opportunities/recommended"),
  listMine: () => apiRequest<OpportunityOut[]>("/opportunities"),
  create: (payload: OpportunityCreateInput) =>
    apiRequest<OpportunityOut>("/opportunities", { method: "POST", body: payload }),
  listCandidates: (opportunityId: string) =>
    apiRequest<CandidateMatchOut[]>(`/opportunities/${opportunityId}/candidates`),
};
