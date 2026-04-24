export default function TechPill({ label }: { label: string }) {
  return (
    <span className="glass rounded-lg px-3 py-1 text-xs font-medium text-slate-600">
      {label}
    </span>
  );
}
