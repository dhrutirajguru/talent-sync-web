import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { dashboardPathForRole } from "@/config/nav";
import { organizationsApi, type OrganizationOut } from "@/api/organizations";
import { ApiError } from "@/api/client";
import type { RoleCode } from "@/types/auth";

const ROLE_OPTIONS: { value: RoleCode; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "ACADEMICIAN", label: "Academician" },
  { value: "INDUSTRY", label: "Industry" },
];

function orgTypeForRole(role: RoleCode): "INSTITUTION" | "INDUSTRY" {
  return role === "INDUSTRY" ? "INDUSTRY" : "INSTITUTION";
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleCode>("STUDENT");
  const [organizations, setOrganizations] = useState<OrganizationOut[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    organizationsApi
      .list(orgTypeForRole(role))
      .then((orgs) => {
        setOrganizations(orgs);
        setOrganizationId(orgs[0]?.id ?? "");
      })
      .catch(() => setOrganizations([]));
  }, [role]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName || undefined,
        role_code: role,
        organization_id: organizationId || undefined,
      });
      navigate(dashboardPathForRole(role), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <h1>⚡ TalentSync</h1>
        <p className="sub">Create your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="field full">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field full">
              <label>Password</label>
              <input
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>I am a</label>
              <select value={role} onChange={(e) => setRole(e.target.value as RoleCode)}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{role === "INDUSTRY" ? "Company" : "Institution"}</label>
              <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
                {organizations.length === 0 && <option value="">No organizations found</option>}
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" disabled={submitting} style={{ width: "100%", marginTop: 20 }}>
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
