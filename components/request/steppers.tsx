'use client';

const STEP_LABELS = ['Contact', 'Practice', 'Profile', 'Additional'];

const tealTick = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1B8B8A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12.5 L10 16.5 L18 8" />
  </svg>
);

/** Four numbered pips joined by 56×1 connectors — steps 1–2 (README §6.8). */
export function StepperFull({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-3">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        return (
          <span key={label} className="contents">
            {i > 0 && <span className="h-px w-14 bg-line-strongest" />}
            <span className="inline-flex items-center gap-2">
              {n < current ? (
                <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[13px] bg-teal-tint">
                  {tealTick(13)}
                </span>
              ) : n === current ? (
                <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[13px] bg-brand text-xs font-bold text-white">
                  {n}
                </span>
              ) : (
                <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[13px] border border-line-strongest text-xs font-semibold text-muted-3">
                  {n}
                </span>
              )}
              <span
                className={
                  n === current
                    ? 'text-[13px] font-semibold text-brand'
                    : n < current
                      ? 'text-[13px] text-ink-700'
                      : 'text-[13px] text-muted-3'
                }
              >
                {label}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** Compact variant for the single-card steps 3–4. */
export function StepperCompact({ current, label }: { current: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: current - 1 }, (_, i) => (
        <span key={i} className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-teal-tint">
          {tealTick(12)}
        </span>
      ))}
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-brand text-meta-xs font-bold text-white">
        {current}
      </span>
      <span className="text-[13px] font-semibold text-brand">{label}</span>
      <span className="flex-1" />
      {current < 4 && <span className="text-xs text-muted-3">4 · Additional</span>}
    </div>
  );
}
