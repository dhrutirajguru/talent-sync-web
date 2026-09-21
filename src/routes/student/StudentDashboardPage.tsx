import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { skillsApi } from "@/api/skills";
import { opportunitiesApi } from "@/api/opportunities";
import { applicationsApi } from "@/api/applications";
import { Donut } from "@/components/Donut";
import { computeSkillScore } from "@/utils/skillScore";

export function StudentDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const skillsQuery = useQuery({ queryKey: ["my-skills"], queryFn: skillsApi.getMySkills });
  const recommendedQuery = useQuery({ queryKey: ["recommended"], queryFn: opportunitiesApi.listRecommended });
  const applicationsQuery = useQuery({ queryKey: ["my-applications"], queryFn: applicationsApi.listMine });

  const loading = skillsQuery.isLoading || recommendedQuery.isLoading || applicationsQuery.isLoading;

  if (loading) {
    return <div className="sub">Loading your dashboard...</div>;
  }

  const skills = skillsQuery.data ?? [];
  const recommended = recommendedQuery.data ?? [];
  const applications = applicationsQuery.data ?? [];
  const skillScore = computeSkillScore(skills);
  const pendingCount = applications.filter((a) => a.status === "SUBMITTED").length;
  const topMatches = recommended.slice(0, 3);

  return (
    <>
      <h1 className="title">Hello, {user?.first_name}!</h1>
      <div className="sub">Build your career, one skill at a time.</div>

      <div className="grid stats">
        <div className="card stat">
          <small>Skill Score</small>
          <strong>{skillScore}%</strong>
          <span className="ico">◉</span>
        </div>
        <div className="card stat">
          <small>Open Opportunities</small>
          <strong>{recommended.length}</strong>
          <span className="ico">▤</span>
        </div>
        <div className="card stat">
          <small>Applications</small>
          <strong>{applications.length}</strong>
          <span className="ico">✓</span>
        </div>
        <div className="card stat">
          <small>Pending Actions</small>
          <strong>{pendingCount}</strong>
          <span className="ico">⚑</span>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 17 }}>
        <div className="card">
          <div className="head">
            <h3>Recommended for You</h3>
            <button className="secondary" onClick={() => navigate("/student/opportunities")}>
              View All
            </button>
          </div>
          <div className="grid three" style={{ marginTop: 14 }}>
            {topMatches.length === 0 && <p className="meta">No opportunities available yet.</p>}
            {topMatches.map((opp) => (
              <div key={opp.id} className="mini" onClick={() => navigate("/student/opportunities")}>
                <div>{opp.opportunity_type === "INTERNSHIP" ? "🎓" : "💼"}</div>
                <h4>{opp.title}</h4>
                <p>Skill match: {Math.round(opp.match_score * 100)}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Skill Score</h3>
          <Donut percent={skillScore} label={`${skillScore}%\nScore`} />
          <small className="meta">
            {skills.length === 0
              ? "Add skills to your profile to get matched with opportunities."
              : `Tracking ${skills.length} skill${skills.length === 1 ? "" : "s"}.`}
          </small>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 17 }}>
        <div className="card">
          <h3>Recent Opportunities</h3>
          {topMatches.length === 0 && <p className="meta">Nothing to show yet.</p>}
          {topMatches.map((opp) => (
            <div className="item" key={opp.id}>
              <div>
                <b>{opp.organization_name}</b>
                <small>
                  {opp.title} • {Math.round(opp.match_score * 100)}% match
                </small>
              </div>
              <button
                className="secondary"
                onClick={async () => {
                  try {
                    await applicationsApi.apply(opp.id);
                    showToast("Application submitted successfully!");
                    applicationsQuery.refetch();
                  } catch {
                    showToast("Could not submit application.");
                  }
                }}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Next Best Actions</h3>
          <div className="note">
            <b>Complete Skill Assessment</b>
            <br />
            Get more accurate recommendations.
          </div>
          <div className="note">
            <b>Update your skill profile</b>
            <br />
            Keep your matches accurate as you learn new things.
          </div>
          <button onClick={() => navigate("/student/skills")}>Update Skill Profile</button>
        </div>
      </div>
    </>
  );
}
