import { mockResponse } from "@/api/mockClient";
import mockData from "@/mocks/portfolio.json";

export interface PortfolioProjectOut {
  id: string;
  title: string;
  description: string;
  related_skill_names: string[];
  project_url: string | null;
  status: string;
}

export interface CertificationOut {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string;
  credential_url: string | null;
  verified: boolean;
}

export interface PortfolioOut {
  projects: PortfolioProjectOut[];
  certifications: CertificationOut[];
}

// TODO(real backend): swap for apiRequest<PortfolioOut>("/users/me/portfolio")
export const portfolioApi = {
  getMine: (): Promise<PortfolioOut> => mockResponse(mockData as PortfolioOut),
};