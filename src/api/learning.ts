import { mockResponse } from "@/api/mockClient";
import mockData from "@/mocks/learningPrograms.json";

export interface LearningProgramOut {
  id: string;
  title: string;
  provider_organization_name: string;
  program_type: string;
  duration_text: string;
  level: string;
  description: string;
  related_skill_names: string[];
}

// TODO(real backend): swap for apiRequest<LearningProgramOut[]>("/learning-programs")
export const learningApi = {
  list: (): Promise<LearningProgramOut[]> => mockResponse(mockData as LearningProgramOut[]),
};