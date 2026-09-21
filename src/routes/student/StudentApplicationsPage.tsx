import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "@/api/applications";

const STATUS_TABS = ["ALL", "SUBMITTED", "SHORTLISTED", "REJECTED", "OFFERED"] as const;

export function StudentApplicationsPage() {
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("ALL");
  const applicationsQuery = useQuery({ queryKey: ["my-applications"], queryFn: applicationsApi.listMine });

  const applications = applicationsQuery.data ?? [];
  const filtered = tab === "ALL" ? applications : applications.filter((a) => a.status === tab);

  function countFor(status: (typeof STATUS_TABS)[number]) {
    return status === "ALL" ? applications.length : applications.filter((a) => a.status === status).length;
  }

  return (
    <>
      <h1 className="title">My Applications</h1>
      <div className="sub">Track every opportunity from application to offer.</div>

      <div className="card">
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              className={tab === status ? "" : "secondary"}
              onClick={() => setTab(status)}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()} ({countFor(status)})
            </button>
          ))}
        </div>

        {applicationsQuery.isLoading && <p className="meta">Loading...</p>}
        {!applicationsQuery.isLoading && filtered.length === 0 && (
          <p className="meta">No applications in this category yet.</p>
        )}

        {filtered.map((app) => (
          <div className="item" key={app.id}>
            <div>
              <b>{app.organization_name}</b>
              <small>
                {app.opportunity_title}
                {app.applied_at ? ` • Applied ${new Date(app.applied_at).toLocaleDateString()}` : ""}
              </small>
            </div>
            <span className={`tag ${app.status === "REJECTED" ? "red" : app.status === "SUBMITTED" ? "" : "orange"}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
