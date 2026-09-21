import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { skillsApi, type UserSkillInput } from "@/api/skills";
import { opportunitiesApi } from "@/api/opportunities";
import { useToast } from "@/context/ToastContext";
import type { ProficiencyLevel } from "@/types/domain";

const LEVELS: ProficiencyLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

export function StudentSkillsPage() {
  const { showToast } = useToast();
  const skillsQuery = useQuery({ queryKey: ["my-skills"], queryFn: skillsApi.getMySkills });
  const catalogQuery = useQuery({ queryKey: ["skill-catalog"], queryFn: skillsApi.listCatalog });
  const recommendedQuery = useQuery({ queryKey: ["recommended"], queryFn: opportunitiesApi.listRecommended });

  const [rows, setRows] = useState<UserSkillInput[]>([]);
  const [addSkillId, setAddSkillId] = useState("");
  const [addLevel, setAddLevel] = useState<ProficiencyLevel>("BEGINNER");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (skillsQuery.data) {
      setRows(
        skillsQuery.data.map((s) => ({
          skill_id: s.skill_id,
          proficiency_level: s.proficiency_level,
          years_experience: s.years_experience,
        }))
      );
    }
  }, [skillsQuery.data]);

  const catalog = catalogQuery.data ?? [];
  const skillNameById = useMemo(() => Object.fromEntries(catalog.map((s) => [s.id, s.name])), [catalog]);
  const availableToAdd = catalog.filter((s) => !rows.some((r) => r.skill_id === s.id));

  const strengths = (skillsQuery.data ?? []).filter(
    (s) => s.proficiency_level === "ADVANCED" || s.proficiency_level === "EXPERT"
  );

  const topGaps = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const opp of recommendedQuery.data ?? []) {
      for (const name of opp.missing_skill_names) {
        counts[name] = (counts[name] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }, [recommendedQuery.data]);

  function addRow() {
    if (!addSkillId) return;
    setRows((prev) => [...prev, { skill_id: addSkillId, proficiency_level: addLevel, years_experience: null }]);
    setAddSkillId("");
    setAddLevel("BEGINNER");
  }

  function removeRow(skillId: string) {
    setRows((prev) => prev.filter((r) => r.skill_id !== skillId));
  }

  function updateLevel(skillId: string, level: ProficiencyLevel) {
    setRows((prev) => prev.map((r) => (r.skill_id === skillId ? { ...r, proficiency_level: level } : r)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await skillsApi.updateMySkills(rows);
      await skillsQuery.refetch();
      showToast("Skill profile updated!");
    } catch {
      showToast("Could not save your skills. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="title">Your Skill Profile</h1>
      <div className="sub">Keep this updated so your opportunity matches stay accurate.</div>

      <div className="grid two">
        <div className="card">
          <h3>Strengths</h3>
          {strengths.length === 0 && <p className="meta">Add skills below to build your profile.</p>}
          {strengths.map((s) => (
            <p key={s.skill_id} className="tag">
              Check {s.skill_name}
            </p>
          ))}
        </div>
        <div className="card">
          <h3>Skill Gaps</h3>
          <p className="meta" style={{ marginBottom: 8 }}>
            Most commonly required skills you do not have yet, across your recommended opportunities.
          </p>
          {topGaps.length === 0 && <p className="meta">No gaps detected. Nice work.</p>}
          {topGaps.map((name) => (
            <p key={name} className="tag orange">
              Gap {name}
            </p>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 17 }}>
        <h3>Edit Skills</h3>

        {rows.map((row) => (
          <div className="item" key={row.skill_id}>
            <div>
              <b>{skillNameById[row.skill_id] ?? row.skill_id}</b>
            </div>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                value={row.proficiency_level}
                onChange={(e) => updateLevel(row.skill_id, e.target.value as ProficiencyLevel)}
                style={{ width: 160, marginTop: 0 }}
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <button className="secondary" onClick={() => removeRow(row.skill_id)}>
                Remove
              </button>
            </span>
          </div>
        ))}

        <div className="item" style={{ marginTop: 8 }}>
          <span style={{ display: "flex", gap: 8, flex: 1 }}>
            <select value={addSkillId} onChange={(e) => setAddSkillId(e.target.value)} style={{ marginTop: 0 }}>
              <option value="">Add a skill...</option>
              {availableToAdd.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={addLevel}
              onChange={(e) => setAddLevel(e.target.value as ProficiencyLevel)}
              style={{ width: 160, marginTop: 0 }}
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button className="secondary" onClick={addRow} disabled={!addSkillId}>
              Add
            </button>
          </span>
        </div>

        <p style={{ textAlign: "right", marginTop: 16 }}>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </p>
      </div>
    </>
  );
}
