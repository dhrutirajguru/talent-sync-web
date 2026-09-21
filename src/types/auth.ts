export type RoleCode = "STUDENT" | "ACADEMICIAN" | "INDUSTRY" | "INSTITUTION_ADMIN" | "PLATFORM_ADMIN";

export interface MeOut {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  role_codes: RoleCode[];
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
