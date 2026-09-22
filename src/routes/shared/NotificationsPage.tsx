import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";

const TABS = ["ALL", "APPLICATION_STATUS", "NEW_OPPORTUNITY_MATCH", "SYSTEM"] as const;
const TAB_LABELS: Record<(typeof TABS)[number], string> = {
  ALL: "All",
  APPLICATION_STATUS: "Applications",
  NEW_OPPORTUNITY_MATCH: "Opportunities",
  SYSTEM: "System",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const notificationsQuery = useQuery({ queryKey: ["notifications"], queryFn: notificationsApi.list });
  const notifications = notificationsQuery.data ?? [];
  const filtered = tab === "ALL" ? notifications : notifications.filter((n) => n.notification_type === tab);

  async function handleMarkRead(id: string) {
    await notificationsApi.markRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <>
      <h1 className="title">Notifications</h1>
      <div className="sub">Stay updated with applications, opportunities, and collaboration activity.</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "" : "secondary"} onClick={() => setTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="card">
        {notificationsQuery.isLoading && <p className="meta">Loading...</p>}
        {!notificationsQuery.isLoading && filtered.length === 0 && <p className="meta">Nothing here yet.</p>}
        {filtered.map((n) => (
          <div
            className="note"
            key={n.id}
            style={{ opacity: n.read ? 0.6 : 1, cursor: n.read ? "default" : "pointer" }}
            onClick={() => !n.read && handleMarkRead(n.id)}
          >
            <b>{n.title}</b>
            <br />
            {n.body}
            <br />
            <small className="meta">{timeAgo(n.created_at)}</small>
          </div>
        ))}
      </div>
    </>
  );
}