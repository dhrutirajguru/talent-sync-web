import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { opportunitiesApi } from "@/api/opportunities";
import { applicationsApi } from "@/api/applications";
import type { ApplicationOut } from "@/types/domain";

export function IndustryDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const opportunitiesQuery = useQuery({ queryKey: ["my-opportunities"], queryFn: opportunitiesApi.listMine });
  const opportunities = opportunitiesQuery.data ?? [];

  // One call per posting to total up applications received — fine at demo scale
  // (see backend comment on the same trade-off in list_candidates_for_opportunity).
  const applicationsQuery = useQuery({
    queryKey: ["all-applications", opportunities.map((o) => o.id)],
    queryFn: async () => {
      const lists = await Promise.all(opportunities.map((o) => applicationsApi.listForOpportunity(o.id)));
      return lists.flat();
    },
    enabled: opportunities.length > 0,
  });

  const applications: ApplicationOut[] = applicationsQuery.data ?? [];
  const recent = [...applications]
    .sort((a, b) => (b.applied_at ?? "").localeCompare(a.applied_at ?? ""))
    .slice(0, 5);

  return (
    <>
      <h1 className="title">Hello, {user?.first_name}!</h1>
      <div className="sub">TalentSync Industry Partner — connect with skill-matched candidates.</div>

      <div className="grid stats">
        <div className="card stat">
          <small>Posted Opportunities</small>
          <strong>{opportunities.length}</strong>
          <span className="ico">▤</span>
        </div>
        <div className="card stat">
          <small>Live Postings</small>
          <strong>{opportunities.filter((o) => o.status === "PUBLISHED").length}</strong>
          <span className="ico">●</span>
        </div>
        <div className="card stat">
          <small>Applications Received</small>
          <strong>{applications.length}</strong>
          <span className="ico">✓</span>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 17 }}>
        <div className="card">
          <div className="head">
            <h3>Recent Applications</h3>
            <button className="secondary" onClick={() => navigate("/industry/applications")}>
              View All
            </button>
          </div>
          {recent.length === 0 && <p className="meta" style={{ marginTop: 12 }}>No applications yet.</p>}
          {recent.map((app) => (
            <div className="item" key={app.id}>
              <div>
                <b>{app.applicant_name}</b>
                <small>{app.opportunity_title}</small>
              </div>
              <span className="tag">{app.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <p>
            <button onClick={() => navigate("/industry/post")}>Post New Opportunity</button>
          </p>
          <p>
            <button className="secondary" onClick={() => navigate("/industry/candidates")}>
              Browse Skill-Matched Candidates
            </button>
          </p>
        </div>
      </div>
    </>
  );
}