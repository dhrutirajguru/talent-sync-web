import { apiRequest } from "@/api/client";
import type { MeOut, RoleCode, TokenResponse } from "@/types/auth";

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  role_code: RoleCode;
  organization_id?: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<MeOut>("/auth/register", { method: "POST", body: payload, auth: false }),

  login: (email: string, password: string) =>
    apiRequest<TokenResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false }),

  me: () => apiRequest<MeOut>("/users/me"),
};
