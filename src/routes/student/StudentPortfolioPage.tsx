import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { portfolioApi } from "@/api/portfolio";
import { skillsApi } from "@/api/skills";
import { useToast } from "@/context/ToastContext";

export function StudentPortfolioPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const portfolioQuery = useQuery({ queryKey: ["portfolio"], queryFn: portfolioApi.getMine });
  const skillsQuery = useQuery({ queryKey: ["my-skills"], queryFn: skillsApi.getMySkills });

  const portfolio = portfolioQuery.data;
  const skills = skillsQuery.data ?? [];

  return (
    <>
      <h1 className="title">My Digital Portfolio</h1>
      <div className="sub">A verified, shareable view of your skills and achievements.</div>

      <div className="card">
        <div className="head">
          <div>
            <h3>
              {user?.first_name} {user?.last_name}
            </h3>
            <small className="meta">TalentSync Verified Profile</small>
          </div>
          <button className="secondary" onClick={() => showToast("Demo resume download started.")}>
            Download Resume
          </button>
        </div>

        <h3 style={{ marginTop: 20 }}>Key Skills</h3>
        <p>
          {skills.map((s) => (
            <span key={s.skill_id} className="tag">
              {s.skill_name}
            </span>
          ))}
        </p>

        <h3 style={{ marginTop: 20 }}>Projects</h3>
        {portfolio?.projects.map((p) => (
          <div className="item" key={p.id}>
            <div>
              <b>{p.title}</b>
              <small>{p.related_skill_names.join(" • ")}</small>
            </div>
          </div>
        ))}

        <h3 style={{ marginTop: 20 }}>Certifications</h3>
        {portfolio?.certifications.map((c) => (
          <div className="item" key={c.id}>
            <div>
              <b>{c.title}</b>
              <small>
                {c.issuing_organization} • Issued {new Date(c.issue_date).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}