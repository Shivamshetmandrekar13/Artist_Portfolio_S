import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  className?: string;
}

/** Small editorial eyebrow shared by the home page sections: ——— LABEL */
export default function SectionHeader({ label, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4 text-[0.6875rem] uppercase tracking-[0.25em]", className)}>
      <span aria-hidden="true" className="h-px w-12 bg-gradient-to-r from-[var(--color-gold-dim)] to-transparent" />
      <span className="text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}
