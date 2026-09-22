import { mockResponse } from "@/api/mockClient";
import mockData from "@/mocks/profileExtras.json";
import type { RoleCode } from "@/types/auth";

type ProfileExtras = Record<string, string>;

// TODO(real backend): swap for apiRequest<ProfileExtras>("/users/me/profile-details")
// and a PUT of the same shape to save changes.
export const profileExtrasApi = {
  getMine: (role: RoleCode): Promise<ProfileExtras> =>
    mockResponse((mockData as Record<string, ProfileExtras>)[role] ?? {}),
  save: (_role: RoleCode, _data: ProfileExtras): Promise<void> => mockResponse(undefined, 300),
};