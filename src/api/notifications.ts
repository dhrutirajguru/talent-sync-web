import { mockResponse } from "@/api/mockClient";
import mockData from "@/mocks/notifications.json";

export interface NotificationOut {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  action_url: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

// TODO(real backend): swap these bodies for apiRequest<...>("/notifications")
// and apiRequest(`/notifications/${id}/read`, { method: "POST" }) once the
// notifications table/endpoints exist (Section 6.2). No caller needs to change.
export const notificationsApi = {
  list: (): Promise<NotificationOut[]> => mockResponse(mockData as NotificationOut[]),
  markRead: (id: string): Promise<void> => mockResponse(undefined, 150),
};