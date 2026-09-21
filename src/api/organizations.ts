import { apiRequest } from "@/api/client";

export interface OrganizationOut {
  id: string;
  name: string;
  organization_type: string;
  city: string | null;
  country: string | null;
}

export const organizationsApi = {
  list: (organizationType?: "INSTITUTION" | "INDUSTRY") =>
    apiRequest<OrganizationOut[]>(
      `/organizations${organizationType ? `?organization_type=${organizationType}` : ""}`,
      { auth: false }
    ),
};
