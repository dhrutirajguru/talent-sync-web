import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { skillsApi } from "@/api/skills";
import { opportunitiesApi, type OpportunitySkillInput } from "@/api/opportunities";
import { useToast } from "@/context/ToastContext";

const TYPE_OPTIONS = ["INTERNSHIP", "JOB", "APPRENTICESHIP", "LIVE_PROJECT"];
const IMPORTANCE_OPTIONS = ["HIGH", "MEDIUM", "LOW"];

export function IndustryPostOpportunityPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const catalogQuery = useQuery({ queryKey: ["skill-catalog"], queryFn: skillsApi.listCatalog });
  const catalog = catalogQuery.data ?? [];

  const [title, setTitle] = useState("");
  const [opportunityType, setOpportunityType] = useState("INTERNSHIP");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Remote");
  const [workMode, setWorkMode] = useState("REMOTE");
  const [durationText, setDurationText] = useState("3 months");
  const [stipend, setStipend] = useState("");

  const [requiredSkills, setRequiredSkills] = useState<OpportunitySkillInput[]>([]);
  const [addSkillId, setAddSkillId] = useState("");
  const [addImportance, setAddImportance] = useState("MEDIUM");
  const [submitting, setSubmitting] = useState(false);

  const skillNameById = useMemo(() => Object.fromEntries(catalog.map((s) => [s.id, s.name])), [catalog]);
  const availableToAdd = catalog.filter((s) => !requiredSkills.some((r) => r.skill_id === s.id));

  function addSkill() {
    if (!addSkillId) return;
    setRequiredSkills((prev) => [...prev, { skill_id: addSkillId, importance: addImportance, required: true }]);
    setAddSkillId("");
    setAddImportance("MEDIUM");
  }

  function removeSkill(skillId: string) {
    setRequiredSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
  }

  async function handleSubmit() {
    if (!title || !description || requiredSkills.length === 0) {
      showToast("Please add a title, description, and at least one required skill.");
      return;
    }
    setSubmitting(true);
    try {
      await opportunitiesApi.create({
        title,
        opportunity_type: opportunityType,
        description,
        location,
        work_mode: workMode,
        duration_text: durationText,
        stipend_amount: stipend ? Number(stipend) : undefined,
        required_skills: requiredSkills,
      });
      showToast("Opportunity published successfully!");
      navigate("/industry/opportunities");
    } catch (err: any) {
      showToast(err?.message ?? "Could not publish this opportunity.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="title">Post New Opportunity</h1>
      <div className="sub">Create an internship, job, or live project opportunity.</div>

      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Job Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frontend Developer Intern" />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={opportunityType} onChange={(e) => setOpportunityType(e.target.value)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="field">
            <label>Work Mode</label>
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div className="field">
            <label>Duration</label>
            <input value={durationText} onChange={(e) => setDurationText(e.target.value)} />
          </div>
          <div className="field">
            <label>Stipend (optional, per month)</label>
            <input value={stipend} onChange={(e) => setStipend(e.target.value)} type="number" placeholder="e.g. 20000" />
          </div>
          <div className="field full">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <h3 style={{ marginTop: 20 }}>Required Skills</h3>
        {requiredSkills.map((skill) => (
          <div className="item" key={skill.skill_id}>
            <div>
              <b>{skillNameById[skill.skill_id] ?? skill.skill_id}</b>
              <small>{skill.importance} importance</small>
            </div>
            <button className="secondary" onClick={() => removeSkill(skill.skill_id)}>
              Remove
            </button>
          </div>
        ))}
        <div className="item" style={{ marginTop: 8 }}>
          <span style={{ display: "flex", gap: 8, flex: 1 }}>
            <select value={addSkillId} onChange={(e) => setAddSkillId(e.target.value)} style={{ marginTop: 0 }}>
              <option value="">Add a required skill...</option>
              {availableToAdd.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select value={addImportance} onChange={(e) => setAddImportance(e.target.value)} style={{ width: 160, marginTop: 0 }}>
              {IMPORTANCE_OPTIONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <button className="secondary" onClick={addSkill} disabled={!addSkillId}>
              Add
            </button>
          </span>
        </div>

        <p style={{ textAlign: "right", marginTop: 20 }}>
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Opportunity"}
          </button>
        </p>
      </div>
    </>
  );
}