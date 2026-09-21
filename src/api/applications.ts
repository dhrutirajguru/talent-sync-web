import { apiRequest } from "@/api/client";
import type { ApplicationOut } from "@/types/domain";

export const applicationsApi = {
  apply: (opportunityId: string, coverLetter?: string) =>
    apiRequest<ApplicationOut>("/applications", {
      method: "POST",
      body: { opportunity_id: opportunityId, cover_letter: coverLetter },
    }),
  listMine: () => apiRequest<ApplicationOut[]>("/applications/me"),
  listForOpportunity: (opportunityId: string) =>
    apiRequest<ApplicationOut[]>(`/opportunities/${opportunityId}/applications`),
};
