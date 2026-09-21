import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { opportunitiesApi } from "@/api/opportunities";
import { applicationsApi } from "@/api/applications";
import { useToast } from "@/context/ToastContext";

export function StudentOpportunitiesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const recommendedQuery = useQuery({ queryKey: ["recommended"], queryFn: opportunitiesApi.listRecommended });
  const applicationsQuery = useQuery({ queryKey: ["my-applications"], queryFn: applicationsApi.listMine });

  const appliedOpportunityIds = useMemo(
    () => new Set((applicationsQuery.data ?? []).map((a) => a.opportunity_id)),
    [applicationsQuery.data]
  );

  const filtered = (recommendedQuery.data ?? []).filter((opp) => {
    const haystack = `${opp.title} ${opp.organization_name} ${opp.required_skills.map((s) => s.skill_name).join(" ")}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  async function handleApply(opportunityId: string) {
    setApplyingId(opportunityId);
    try {
      await applicationsApi.apply(opportunityId);
      showToast("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    } catch (err: any) {
      showToast(err?.message ?? "Could not submit application.");
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <>
      <h1 className="title">Internships & Job Opportunities</h1>
      <div className="sub">Discover opportunities matched to your skills, ranked by fit.</div>

      <div className="card">
        <input
          placeholder="Search opportunities, companies or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {recommendedQuery.isLoading && <p className="meta" style={{ marginTop: 16 }}>Loading...</p>}
        {!recommendedQuery.isLoading && filtered.length === 0 && (
          <p className="meta" style={{ marginTop: 16 }}>No opportunities match your search.</p>
        )}

        {filtered.map((opp) => {
          const alreadyApplied = appliedOpportunityIds.has(opp.id);
          return (
            <div key={opp.id} className="item" style={{ alignItems: "flex-start" }}>
              <div>
                <b>{opp.organization_name}</b>
                <small>
                  {opp.title} • {opp.location ?? "Location flexible"} • {Math.round(opp.match_score * 100)}% match
                </small>
                <div style={{ marginTop: 6 }}>
                  {opp.matched_skill_names.map((name) => (
                    <span key={name} className="tag">
                      {name}
                    </span>
                  ))}
                  {opp.missing_skill_names.map((name) => (
                    <span key={name} className="tag orange">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="secondary"
                disabled={alreadyApplied || applyingId === opp.id}
                onClick={() => handleApply(opp.id)}
              >
                {alreadyApplied ? "Applied" : applyingId === opp.id ? "Applying..." : "Apply"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
