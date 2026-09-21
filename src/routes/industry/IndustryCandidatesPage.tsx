import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { opportunitiesApi } from "@/api/opportunities";

export function IndustryCandidatesPage() {
  const [selectedId, setSelectedId] = useState("");

  const opportunitiesQuery = useQuery({ queryKey: ["my-opportunities"], queryFn: opportunitiesApi.listMine });
  const opportunities = opportunitiesQuery.data ?? [];

  const candidatesQuery = useQuery({
    queryKey: ["candidates", selectedId],
    queryFn: () => opportunitiesApi.listCandidates(selectedId),
    enabled: !!selectedId,
  });
  const candidates = candidatesQuery.data ?? [];

  return (
    <>
      <h1 className="title">Skill-Matched Candidates</h1>
      <div className="sub">Find candidates ranked by fit for one of your postings.</div>

      <div className="card">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select an opportunity...</option>
          {opportunities.map((opp) => (
            <option key={opp.id} value={opp.id}>
              {opp.title}
            </option>
          ))}
        </select>

        {selectedId && candidatesQuery.isLoading && <p className="meta" style={{ marginTop: 16 }}>Loading candidates...</p>}
        {selectedId && !candidatesQuery.isLoading && candidates.length === 0 && (
          <p className="meta" style={{ marginTop: 16 }}>No student candidates found.</p>
        )}

        {candidates.map((c) => (
          <div key={c.user_id} className="item" style={{ alignItems: "flex-start", marginTop: 8 }}>
            <div>
              <b>
                {c.first_name} {c.last_name} — {Math.round(c.match_score * 100)}% Match
              </b>
              <small>{c.email}</small>
              <div style={{ marginTop: 6 }}>
                {c.matched_skill_names.map((name) => (
                  <span key={name} className="tag">
                    {name}
                  </span>
                ))}
                {c.missing_skill_names.map((name) => (
                  <span key={name} className="tag orange">
                    {name}
                  </span>
                ))}
              </div>
            </div>
            {c.has_applied && <span className="tag">Applied</span>}
          </div>
        ))}
      </div>
    </>
  );
}