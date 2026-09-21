interface DonutProps {
  percent: number;
  label: string;
}

export function Donut({ percent, label }: DonutProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="donut"
      data-label={label}
      style={{ background: `conic-gradient(var(--b) 0 ${clamped}%, #e8edf5 ${clamped}%)` }}
    />
  );
}
