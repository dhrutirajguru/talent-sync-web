export interface SkillOut {
  id: string;
  name: string;
  category_id: string | null;
  skill_type: string | null;
}

export type ProficiencyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface UserSkillOut {
  skill_id: string;
  skill_name: string;
  proficiency_level: ProficiencyLevel;
  years_experience: number | null;
  verified: boolean;
}

export interface OpportunitySkillOut {
  skill_id: string;
  skill_name: string;
  required_level: string | null;
  importance: string;
  required: boolean;
}

export interface OpportunityOut {
  id: string;
  organization_id: string;
  organization_name: string;
  title: string;
  opportunity_type: string;
  description: string;
  location: string | null;
  work_mode: string | null;
  status: string;
  required_skills: OpportunitySkillOut[];
}

export interface OpportunityMatchOut extends OpportunityOut {
  match_score: number;
  matched_skill_names: string[];
  missing_skill_names: string[];
}

export interface CandidateMatchOut {
  user_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  match_score: number;
  matched_skill_names: string[];
  missing_skill_names: string[];
  has_applied: boolean;
}

export interface ApplicationOut {
  id: string;
  opportunity_id: string;
  opportunity_title: string;
  organization_name: string;
  applicant_user_id: string;
  applicant_name: string;
  status: string;
  applied_at: string | null;
}
