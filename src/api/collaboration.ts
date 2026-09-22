import { mockResponse } from "@/api/mockClient";
import mockData from "@/mocks/collaborations.json";

export interface CollaborationOut {
  id: string;
  title: string;
  collaboration_type: string;
  partner_organization_name: string;
  description: string;
  status: string;
  start_date: string;
}

// TODO(real backend): swap for apiRequest<CollaborationOut[]>("/collaborations")
export const collaborationApi = {
  list: (): Promise<CollaborationOut[]> => mockResponse(mockData as CollaborationOut[]),
  join: (id: string): Promise<void> => mockResponse(undefined, 200),
};