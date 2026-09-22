import { useQuery } from "@tanstack/react-query";
import { institutionAnalyticsApi } from "@/api/institutionAnalytics";

export function AcademicianInstitutionAnalyticsPage() {
  const analyticsQuery = useQuery({ queryKey: ["institution-analytics"], queryFn: institutionAnalyticsApi.get });
  const data = analyticsQuery.data;
  const maxPlacements = Math.max(1, ...(data?.placement_trends.map((t) => t.placements) ?? [1]));
  const totalDistribution = (data?.skill_distribution ?? []).reduce((sum, d) => sum + d.student_count, 0) || 1;

  return (
    <>
      <h1 className="title">Institution Analytics</h1>
      <div className="sub">Institution-level insights for skills, internships, and placements.</div>

      <div className="grid stats">
        <div className="card stat">
          <small>Total Students</small>
          <strong>{data?.total_students.toLocaleString() ?? "-"}</strong>
          <span className="ico">👥</span>
        </div>
        <div className="card stat">
          <small>Placement Rate</small>
          <strong>{data?.placement_rate ?? "-"}%</strong>
          <span className="ico">✓</span>
        </div>
        <div className="card stat">
          <small>Active Internships</small>
          <strong>{data?.active_internships ?? "-"}</strong>
          <span className="ico">▤</span>
        </div>
        <div className="card stat">
          <small>Industry Partners</small>
          <strong>{data?.industry_partners ?? "-"}</strong>
          <span className="ico">▥</span>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 17 }}>
        <div className="card">
          <h3>Placement Trends</h3>
          <div className="barbox">
            {data?.placement_trends.map((t) => (
              <div key={t.period} className="bar" style={{ height: `${(t.placements / maxPlacements) * 180}px` }}>
                <small>{t.period}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Skill Distribution</h3>
          {data?.skill_distribution.map((d) => (
            <div key={d.skill_category} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>{d.skill_category}</span>
                <span className="meta">{Math.round((d.student_count / totalDistribution) * 100)}%</span>
              </div>
              <div className="progress">
                <span style={{ width: `${(d.student_count / totalDistribution) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}