'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { products } from '@/lib/catalog';
import { resetButton } from '@/lib/ui';
import { useRequestList } from '@/components/RequestListContext';
import { SelectField } from '@/components/request/fields';
import { useWizard } from '@/components/request/RequestWizardContext';
import { StepperCompact } from '@/components/request/steppers';

const PRACTICE_TYPES = [
  'Integrative & functional medicine',
  'Primary care',
  'Med spa / aesthetics',
  'Wellness & longevity clinic',
  'Specialty clinic',
  'Other',
];

export default function ProfileStep() {
  const router = useRouter();
  const { data, update } = useWizard();
  const { items } = useRequestList();
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const interestsId = useId();

  // Seed the tokens from the request list on first arrival (README §6.8).
  useEffect(() => {
    if (data.interests === null) update({ interests: items.map((i) => i.name) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.interests]);

  const tokens = data.interests ?? [];
  const remaining = products
    .map((p) => p.name)
    .filter((name) => !tokens.includes(name))
    .filter((name) => !input.trim() || name.toLowerCase().includes(input.trim().toLowerCase()));

  const addToken = (name: string) => {
    update({ interests: [...tokens, name] });
    setInput('');
    inputRef.current?.focus();
  };
  const removeToken = (name: string) => update({ interests: tokens.filter((t) => t !== name) });

  const showSuggestions = focused && remaining.length > 0;

  return (
    <div className="flex flex-1 flex-col bg-surface-form">
      <div className="flex justify-center px-4 pb-[76px] pt-11 sm:px-6">
        <div className="flex w-full max-w-card flex-col gap-[22px] overflow-hidden rounded-[14px] border border-line-card bg-white px-5 pb-11 pt-9 sm:px-10">
          <StepperCompact current={3} label="Practice profile" />

          <SelectField
            label="Practice type"
            name="practiceType"
            value={data.practiceType}
            onChange={(v) => update({ practiceType: v })}
            options={PRACTICE_TYPES}
          />

          <div className="flex flex-col gap-[7px]">
            <label htmlFor={interestsId} className="text-[13px] font-semibold text-navy">
              Products or medications of interest
            </label>
            <div
              onClick={() => inputRef.current?.focus()}
              // The border is brand-coloured at rest, so only a ring can show focus here.
              className="flex min-h-12 cursor-text flex-wrap items-center gap-2 rounded-[10px] border-[1.5px] border-brand bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-brand"
            >
              {tokens.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToken(t);
                  }}
                  aria-label={`Remove ${t}`}
                  className="cursor-pointer rounded-full border-none bg-brand-tint px-3 py-1.5 font-sans text-[13px] font-medium text-brand hover:bg-brand-tintHover"
                >
                  {t} ×
                </button>
              ))}
              <input
                ref={inputRef}
                id={interestsId}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 120)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && remaining.length) {
                    e.preventDefault();
                    addToken(remaining[0]);
                  } else if (e.key === 'Backspace' && !input && tokens.length) {
                    removeToken(tokens[tokens.length - 1]);
                  }
                }}
                placeholder={tokens.length ? 'Add more…' : 'Type a formulation…'}
                className="h-8 min-w-[110px] flex-1 border-none bg-transparent text-sm text-navy outline-none placeholder:text-muted-3"
              />
            </div>
            {showSuggestions && (
              <div className="overflow-hidden rounded-[10px] border border-line-panel bg-white shadow-suggest">
                {remaining.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    // mousedown, not click: the input's blur would unmount the
                    // list before a click could land.
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addToken(name);
                    }}
                    className={`${resetButton} w-full px-3.5 py-[11px] text-sm text-ink-700 hover:bg-surface-alt ${
                      i === 0 ? 'bg-surface-alt' : ''
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <Link
              href="/request/practice"
              className="inline-flex h-[46px] items-center rounded-full border border-line-strongest bg-white px-6 font-sans text-sm font-semibold text-navy no-underline hover:border-brand hover:text-brand"
            >
              Back
            </Link>
            <button
              onClick={() => router.push('/request/additional')}
              className="inline-flex h-[46px] cursor-pointer items-center rounded-full border-none bg-brand px-7 font-sans text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
