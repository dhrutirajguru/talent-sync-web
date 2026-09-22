import { useQuery } from "@tanstack/react-query";
import { collaborationApi } from "@/api/collaboration";
import { useToast } from "@/context/ToastContext";

export function CollaborationPage() {
  const { showToast } = useToast();
  const collaborationsQuery = useQuery({ queryKey: ["collaborations"], queryFn: collaborationApi.list });
  const collaborations = collaborationsQuery.data ?? [];

  async function handleJoin(id: string) {
    await collaborationApi.join(id);
    showToast("Action completed successfully!");
  }

  return (
    <>
      <h1 className="title">Industry Collaboration</h1>
      <div className="sub">Mentorship, workshops, guest lectures, and live projects.</div>

      <div className="card">
        {collaborationsQuery.isLoading && <p className="meta">Loading...</p>}
        {collaborations.map((c) => (
          <div className="item" key={c.id}>
            <div>
              <b>
                {c.partner_organization_name} — {c.title}
              </b>
              <small>
                {c.collaboration_type.replace("_", " ")} • Starts {new Date(c.start_date).toLocaleDateString()}
              </small>
            </div>
            <button className="secondary" onClick={() => handleJoin(c.id)}>
              Join
            </button>
          </div>
        ))}
      </div>
    </>
  );
}