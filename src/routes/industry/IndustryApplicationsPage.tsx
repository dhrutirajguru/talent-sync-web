import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { opportunitiesApi } from "@/api/opportunities";
import { applicationsApi } from "@/api/applications";

export function IndustryApplicationsPage() {
  const [selectedId, setSelectedId] = useState("");

  const opportunitiesQuery = useQuery({ queryKey: ["my-opportunities"], queryFn: opportunitiesApi.listMine });
  const opportunities = opportunitiesQuery.data ?? [];

  const applicationsQuery = useQuery({
    queryKey: ["applications-for-opportunity", selectedId],
    queryFn: () => applicationsApi.listForOpportunity(selectedId),
    enabled: !!selectedId,
  });
  const applications = applicationsQuery.data ?? [];

  return (
    <>
      <h1 className="title">Applications</h1>
      <div className="sub">See who has applied to your postings.</div>

      <div className="card">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select an opportunity...</option>
          {opportunities.map((opp) => (
            <option key={opp.id} value={opp.id}>
              {opp.title}
            </option>
          ))}
        </select>

        {selectedId && applicationsQuery.isLoading && <p className="meta" style={{ marginTop: 16 }}>Loading...</p>}
        {selectedId && !applicationsQuery.isLoading && applications.length === 0 && (
          <p className="meta" style={{ marginTop: 16 }}>No applications for this posting yet.</p>
        )}

        {applications.map((app) => (
          <div className="item" key={app.id}>
            <div>
              <b>{app.applicant_name}</b>
              <small>
                {app.applied_at ? `Applied ${new Date(app.applied_at).toLocaleDateString()}` : ""}
              </small>
            </div>
            <span className="tag">{app.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}