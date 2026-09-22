import { useQuery } from "@tanstack/react-query";
import { learningApi } from "@/api/learning";

export function LearningProgramsPage({ title, subtitle }: { title: string; subtitle: string }) {
  const programsQuery = useQuery({ queryKey: ["learning-programs"], queryFn: learningApi.list });
  const programs = programsQuery.data ?? [];

  return (
    <>
      <h1 className="title">{title}</h1>
      <div className="sub">{subtitle}</div>

      <div className="grid three">
        {programs.map((p) => (
          <div key={p.id} className="mini" style={{ cursor: "default" }}>
            <div>{p.program_type === "CERTIFICATION" ? "🏅" : p.program_type === "FDP" ? "🎓" : "📘"}</div>
            <h4>{p.title}</h4>
            <p>
              {p.provider_organization_name} • {p.duration_text}
            </p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 17 }}>
        <h3>About these programs</h3>
        {programsQuery.isLoading && <p className="meta">Loading...</p>}
        {programs.map((p) => (
          <div className="item" key={p.id}>
            <div>
              <b>{p.title}</b>
              <small>{p.description}</small>
              <div style={{ marginTop: 6 }}>
                {p.related_skill_names.map((name) => (
                  <span key={name} className="tag">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}