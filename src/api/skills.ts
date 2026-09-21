import { apiRequest } from "@/api/client";
import type { SkillOut, UserSkillOut, ProficiencyLevel } from "@/types/domain";

export interface UserSkillInput {
  skill_id: string;
  proficiency_level: ProficiencyLevel;
  years_experience?: number | null;
}

export const skillsApi = {
  listCatalog: () => apiRequest<SkillOut[]>("/skills"),
  getMySkills: () => apiRequest<UserSkillOut[]>("/users/me/skills"),
  updateMySkills: (skills: UserSkillInput[]) =>
    apiRequest<UserSkillOut[]>("/users/me/skills", { method: "PUT", body: { skills } }),
};
