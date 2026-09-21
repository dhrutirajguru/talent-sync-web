import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyInstitution } from "@/hooks/useMyInstitution";
import { institutionsApi } from "@/api/institutions";

export function AcademicianDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const institutionQuery = useMyInstitution();
  const institution = institutionQuery.data;

  const reportQuery = useQuery({
    queryKey: ["skill-gap", institution?.id],
    queryFn: () => institutionsApi.getSkillGapReport(institution!.id),
    enabled: !!institution,
  });
  const report = reportQuery.data;
  const topGap = report?.gaps[0];

  return (
    <>
      <h1 className="title">Hello, Dr. {user?.last_name ?? user?.first_name}!</h1>
      <div className="sub">{institution?.name ?? "Loading institution..."}</div>

      <div className="grid stats">
        <div className="card stat">
          <small>Students</small>
          <strong>{report?.total_students ?? "-"}</strong>
          <span className="ico">👥</span>
        </div>
        <div className="card stat">
          <small>Internships</small>
          <strong>45</strong>
          <span className="ico">▤</span>
        </div>
        <div className="card stat">
          <small>Collaborations</small>
          <strong>8</strong>
          <span className="ico">↔</span>
        </div>
        <div className="card stat">
          <small>FDPs</small>
          <strong>3</strong>
          <span className="ico">▧</span>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 17 }}>
        <div className="card">
          <div className="head">
            <h3>Top Institutional Skill Gap</h3>
            <button className="secondary" onClick={() => navigate("/academician/skill-gap")}>
              View Full Report
            </button>
          </div>
          {reportQuery.isLoading && <p className="meta" style={{ marginTop: 12 }}>Loading...</p>}
          {topGap ? (
            <div className="note" style={{ marginTop: 12 }}>
              <b>{topGap.skill_name}</b>
              <br />
              Required by {topGap.demand_count} live opportunit{topGap.demand_count === 1 ? "y" : "ies"}, held by only{" "}
              {topGap.supply_count} of your students.
            </div>
          ) : (
            !reportQuery.isLoading && <p className="meta" style={{ marginTop: 12 }}>No skill gaps detected right now.</p>
          )}
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <p>
            <button onClick={() => navigate("/academician/skill-gap")}>View Skill Gap Report</button>
          </p>
          <p>
            <button className="secondary" onClick={() => navigate("/academician/collaboration")}>
              Explore Industry Programs
            </button>
          </p>
        </div>
      </div>
    </>
  );
}