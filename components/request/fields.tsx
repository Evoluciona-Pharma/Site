'use client';

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

function fieldBorder(error?: string) {
  return error
    ? 'border-[1.5px] border-danger bg-danger-field'
    : 'border border-line-strong bg-white focus-within:border-[1.5px] focus-within:border-brand';
}

export function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      <span className={label13}>{label}</span>
      <div className={`flex h-12 items-center rounded-[10px] px-[15px] ${fieldBorder(error)}`}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full border-none bg-transparent text-body text-navy outline-none placeholder:text-muted-3"
        />
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      <span className={label13}>{label}</span>
      <div className={`relative flex h-12 items-center rounded-[10px] ${fieldBorder(error)}`}>
        <select
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
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

export function ErrorBanner({ count, detail }: { count: number; detail: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-danger-border bg-danger-bg px-4 py-3.5">
      <span className="text-[13px] leading-5 text-danger-text">
        <strong>
          {count} {count === 1 ? 'field needs' : 'fields need'} attention.
        </strong>{' '}
        {detail} before you can continue.
      </span>
    </div>
  );
}
