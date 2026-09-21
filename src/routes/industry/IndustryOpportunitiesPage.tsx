import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { opportunitiesApi } from "@/api/opportunities";

export function IndustryOpportunitiesPage() {
  const navigate = useNavigate();
  const opportunitiesQuery = useQuery({ queryKey: ["my-opportunities"], queryFn: opportunitiesApi.listMine });
  const opportunities = opportunitiesQuery.data ?? [];

  return (
    <>
      <h1 className="title">My Opportunities</h1>
      <div className="sub">Postings from your organization.</div>

      <div className="card">
        {opportunitiesQuery.isLoading && <p className="meta">Loading...</p>}
        {!opportunitiesQuery.isLoading && opportunities.length === 0 && (
          <p className="meta">
            You haven't posted anything yet. <button onClick={() => navigate("/industry/post")}>Post one now</button>
          </p>
        )}
        {opportunities.map((opp) => (
          <div key={opp.id} className="item" style={{ alignItems: "flex-start" }}>
            <div>
              <b>{opp.title}</b>
              <small>
                {opp.opportunity_type} • {opp.location ?? "Location flexible"} • {opp.status}
              </small>
              <div style={{ marginTop: 6 }}>
                {opp.required_skills.map((s) => (
                  <span key={s.skill_id} className="tag">
                    {s.skill_name}
                  </span>
                ))}
              </div>
            </div>
            <span style={{ display: "flex", gap: 8 }}>
              <button className="secondary" onClick={() => navigate("/industry/candidates")}>
                Candidates
              </button>
              <button className="secondary" onClick={() => navigate("/industry/applications")}>
                Applicants
              </button>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}