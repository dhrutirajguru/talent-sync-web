import type { UserSkillOut } from "@/types/domain";

const LEVEL_SCORE: Record<string, number> = {
  BEGINNER: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100,
};

/**
 * Simple average-proficiency percentage, used for the dashboard's "Skill
 * Score" stat and donut (mirrors the mockup's screen 4 visual). This is a
 * display heuristic, not the matching engine's score (see matching_service
 * on the backend) — kept intentionally simple for the demo.
 */
export function computeSkillScore(skills: UserSkillOut[]): number {
  if (skills.length === 0) return 0;
  const total = skills.reduce((sum, s) => sum + (LEVEL_SCORE[s.proficiency_level] ?? 0), 0);
  return Math.round(total / skills.length);
}
