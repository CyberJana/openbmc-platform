interface StatusCardProps {
  title: string;
  value: string;
  subtitle?: string;
  tone?: "default" | "good" | "warn" | "critical";
}

export function StatusCard({ title, value, subtitle, tone = "default" }: StatusCardProps) {
  const toneClass =
    tone === "good"
      ? "status-card-good"
      : tone === "warn"
        ? "status-card-warn"
        : tone === "critical"
          ? "status-card-critical"
          : "status-card-default";

  return (
    <div className={`status-card ${toneClass}`}>
      <p className="status-card-title">{title}</p>
      <p className="status-card-value">{value}</p>
      {subtitle ? <p className="status-card-subtitle">{subtitle}</p> : null}
    </div>
  );
}
