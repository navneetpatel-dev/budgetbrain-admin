import { detectionStyles } from '../styles/detection.styles';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className={detectionStyles.stat}>
      <span className={detectionStyles.statLabel}>{label}</span>
      <span className={detectionStyles.statValue}>{value}</span>
      {hint && <span className={detectionStyles.statHint}>{hint}</span>}
    </div>
  );
}
