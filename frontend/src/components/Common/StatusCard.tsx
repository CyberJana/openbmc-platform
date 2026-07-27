interface StatusCardProps {
  label: string;
  value: string | number;
}

function StatusCard({ label, value }: StatusCardProps) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export default StatusCard;
