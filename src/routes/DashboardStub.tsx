import { useAuth } from "@/context/AuthContext";

export function DashboardStub({ roleLabel }: { roleLabel: string }) {
  const { user } = useAuth();

  return (
    <>
      <h1 className="title">Hello, {user?.first_name}!</h1>
      <div className="sub">
        {roleLabel} • {user?.email}
      </div>
      <div className="card">
        <h3>You're logged in.</h3>
        <p className="meta">
          Role(s): {user?.role_codes.join(", ")} — this confirms the JWT auth flow and
          role-driven navigation are wired correctly. The real dashboard content for this
          role is built in the next step.
        </p>
      </div>
    </>
  );
}
