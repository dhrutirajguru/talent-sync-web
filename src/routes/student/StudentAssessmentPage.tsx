import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";

const QUESTIONS = [
  {
    prompt: "Which programming languages are you familiar with?",
    options: ["Python", "Java", "C/C++", "JavaScript"],
  },
  {
    prompt: "How comfortable are you with problem solving?",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    prompt: "Which area interests you most?",
    options: ["Web Development", "Data Science / AI", "Cloud", "Cybersecurity"],
  },
];

export function StudentAssessmentPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    // Mock: the real assessment-to-skill-profile pipeline isn't built yet
    // (Section 6.1) — your actual skill profile already reflects seeded
    // data on the Skill Mapping page.
    await new Promise((resolve) => setTimeout(resolve, 600));
    showToast("Skill profile generated!");
    setSubmitting(false);
    navigate("/student/skills");
  }

  return (
    <>
      <h1 className="title">Skill Assessment</h1>
      <div className="sub">Tell us about your current technical and professional skills.</div>

      <div className="card">
        {QUESTIONS.map((q) => (
          <div className="q" key={q.prompt}>
            <b>{q.prompt}</b>
            {q.options.map((opt) => (
              <label key={opt}>
                <input type="checkbox" /> {opt}
              </label>
            ))}
          </div>
        ))}
        <p style={{ textAlign: "right" }}>
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Generating..." : "Generate My Skill Profile"}
          </button>
        </p>
      </div>
    </>
  );
}