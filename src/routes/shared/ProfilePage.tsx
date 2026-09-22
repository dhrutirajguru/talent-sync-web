import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { profileExtrasApi } from "@/api/profileExtras";
import { useToast } from "@/context/ToastContext";

const FIELD_LABELS: Record<string, Record<string, string>> = {
  STUDENT: {
    college_name: "College",
    branch: "Branch",
    year: "Year",
    career_interests: "Career Interests",
  },
  ACADEMICIAN: {
    department: "Department",
    designation: "Designation",
    specialization: "Specialization",
    research_interests: "Research Interests",
  },
  INDUSTRY: {
    company_name: "Company",
    department: "Department",
    designation: "Designation",
    expertise: "Areas of Expertise",
  },
};

export function ProfilePage({ title }: { title: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const role = user?.role_codes[0] ?? "STUDENT";

  const extrasQuery = useQuery({
    queryKey: ["profile-extras", role],
    queryFn: () => profileExtrasApi.getMine(role as any),
  });

  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (extrasQuery.data) setFields(extrasQuery.data);
  }, [extrasQuery.data]);

  const labels = FIELD_LABELS[role] ?? {};

  async function handleSave() {
    setSaving(true);
    try {
      await profileExtrasApi.save(role as any, fields);
      showToast("Profile updated!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="title">{title}</h1>
      <div className="sub">Manage your TalentSync profile.</div>

      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input value={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`} disabled />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={user?.email ?? ""} disabled />
          </div>
          {Object.entries(labels).map(([key, label]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input
                value={fields[key] ?? ""}
                onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <p>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </p>
      </div>
    </>
  );
}