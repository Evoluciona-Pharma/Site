'use client';

import { useId } from 'react';
import { peerRing } from '@/lib/ui';

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
];

const label13 = 'text-[13px] font-semibold text-navy';

/** A ring rather than a thicker border on focus: `border` and
    `focus-within:border-[1.5px]` both set border-width, and the base class wins
    in the generated order, so the width change never actually applied. */
function fieldBorder(error?: string) {
  return error
    ? 'border-[1.5px] border-danger bg-danger-field'
    : 'border border-line-strong bg-white focus-within:border-brand focus-within:ring-1 focus-within:ring-brand';
}

/** The label is a real `<label htmlFor>` rather than a `<span>`, so the field has
    a programmatic name; `<label>` and `<span>` are both inline under preflight,
    so the layout is unchanged. Errors are wired with aria-invalid and
    aria-describedby, so the message is tied to the field it belongs to. */
export function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  name,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={id} className={label13}>
        {label}
      </label>
      <div className={`flex h-12 items-center rounded-[10px] px-[15px] ${fieldBorder(error)}`}>
        <input
          id={id}
          name={name}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full border-none bg-transparent text-body text-navy outline-none placeholder:text-muted-3"
        />
      </div>
      {error && (
        <span id={errorId} className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select…',
  name,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={id} className={label13}>
        {label}
      </label>
      <div className={`relative flex h-12 items-center rounded-[10px] ${fieldBorder(error)}`}>
        <select
          id={id}
          name={name}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-full w-full cursor-pointer appearance-none border-none bg-transparent pl-[15px] pr-10 text-body outline-none ${
            value ? 'text-navy' : 'text-muted-3'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8C93A0"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-[15px]"
        >
          <path d="M6 9 L12 15 L18 9" />
        </svg>
      </div>
      {error && (
        <span id={errorId} className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}

/** The attestation control. A real checkbox drives it — the design's custom box
    is drawn alongside and hidden from assistive tech, with the focus ring
    forwarded onto it via `peerRing`. Without this the control sits outside the
    tab order entirely, and since submission is gated on the attestation, a
    keyboard-only provider cannot submit a request at all. */
export function CheckboxField({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={error || undefined}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] ${peerRing} ${
          checked ? 'border-brand bg-brand' : 'border-line-strongest bg-white'
        }`}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 12.5 L10 16.5 L18 8" />
          </svg>
        )}
      </span>
      <span className="text-[13px] leading-5 text-ink-600">{children}</span>
    </label>
  );
}

/** `role="alert"` so the failure is announced, and focusable so the step pages
    can move the user to it on a failed submit (WCAG 3.3.1, 4.1.3). */
export function ErrorBanner({
  count,
  detail,
  ref,
}: {
  count: number;
  detail: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="flex gap-3 rounded-xl border border-danger-border bg-danger-bg px-4 py-3.5"
    >
      <span className="text-[13px] leading-5 text-danger-text">
        <strong>
          {count} {count === 1 ? 'field needs' : 'fields need'} attention.
        </strong>{' '}
        {detail} before you can continue.
      </span>
    </div>
  );
}
