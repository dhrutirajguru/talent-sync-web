import { useQuery } from "@tanstack/react-query";
import { useMyInstitution } from "@/hooks/useMyInstitution";
import { institutionsApi } from "@/api/institutions";

export function AcademicianSkillGapPage() {
  const institutionQuery = useMyInstitution();
  const institution = institutionQuery.data;

  const reportQuery = useQuery({
    queryKey: ["skill-gap", institution?.id],
    queryFn: () => institutionsApi.getSkillGapReport(institution!.id),
    enabled: !!institution,
  });
  const report = reportQuery.data;
  const maxDemand = Math.max(1, ...(report?.gaps.map((g) => g.demand_count) ?? [1]));

  return (
    <>
      <h1 className="title">Skill Gap Report</h1>
      <div className="sub">
        Demand across every live opportunity, compared against what this institution's students already have.
      </div>

      <div className="card">
        {reportQuery.isLoading && <p className="meta">Loading report...</p>}
        {!reportQuery.isLoading && (report?.gaps.length ?? 0) === 0 && (
          <p className="meta">No skill demand data yet. Check back once industry postings come in.</p>
        )}

        {report?.gaps.map((gap) => (
          <div key={gap.skill_id} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <b>{gap.skill_name}</b>
              <span className="meta">
                {gap.supply_count}/{gap.demand_count} students covered {" "}
                {gap.gap_score > 0 ? (
                  <span style={{ color: "#c9424d" }}>- gap of {gap.gap_score}</span>
                ) : (
                  <span style={{ color: "#13846e" }}>- fully covered</span>
                )}
              </span>
            </div>
            <div className="progress">
              <span
                style={{
                  width: `${(gap.supply_count / maxDemand) * 100}%`,
                  background: "linear-gradient(90deg, var(--t), var(--b))",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}