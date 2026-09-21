export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <h1 className="title">{title}</h1>
      <div className="sub">This screen will be built in an upcoming step.</div>
      <div className="card">
        <h3>Coming soon</h3>
        <p className="meta">Use the sidebar to explore other sections.</p>
      </div>
    </>
  );
}
