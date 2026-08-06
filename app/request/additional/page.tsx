'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { compliance } from '@/lib/catalog';
import { useRequestList } from '@/components/RequestListContext';
import { ErrorBanner, SelectField } from '@/components/request/fields';
import { useWizard } from '@/components/request/RequestWizardContext';
import { StepperCompact } from '@/components/request/steppers';

const HEAR_ABOUT = [
  'Colleague referral',
  'Conference or event',
  'Sales representative',
  'Online search',
  'Social media',
  'Other',
];

export default function AdditionalStep() {
  const router = useRouter();
  const { data, update, setSubmitted } = useWizard();
  const { items, clear } = useRequestList();
  const [error, setError] = useState(false);

  const submit = () => {
    if (!data.attestation) {
      setError(true);
      return;
    }
    const reference = `REQ-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setSubmitted({ reference, items });
    clear(); // the nav bag count resets to 0 on confirmation (README §6.8)
    router.push('/request/confirmation');
  };

  return (
    <div className="flex flex-1 flex-col bg-surface-form">
      <div className="flex justify-center px-4 pb-[76px] pt-11 sm:px-6">
        <div className="flex w-full max-w-card flex-col gap-[22px] overflow-hidden rounded-[14px] border border-line-card bg-white px-5 pb-11 pt-9 sm:px-10">
          <StepperCompact current={4} label="Additional information" />

          {error && <ErrorBanner count={1} detail="The provider attestation is required" />}

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-semibold text-navy">Message or special requirements</span>
            <textarea
              value={data.message}
              onChange={(e) => update({ message: e.target.value })}
              placeholder="Optional. Share program context, expected volume, or questions for the pharmacy team."
              className="h-[118px] resize-none rounded-[10px] border border-line-strong px-[15px] py-3 text-body text-navy outline-none placeholder:text-muted-3 focus:border-[1.5px] focus:border-brand"
            />
          </div>

          <SelectField
            label="How did you hear about Evoluciona Pharma?"
            value={data.hearAbout}
            onChange={(v) => update({ hearAbout: v })}
            options={HEAR_ABOUT}
          />

          <label className="flex cursor-pointer items-start gap-2.5">
            <span
              onClick={() => {
                update({ attestation: !data.attestation });
                setError(false);
              }}
              className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] ${
                data.attestation ? 'border-brand bg-brand' : 'border-line-strongest bg-white'
              }`}
            >
              {data.attestation && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 12.5 L10 16.5 L18 8" />
                </svg>
              )}
            </span>
            <span className="text-[13px] leading-5 text-ink-600">{compliance.attestation}</span>
          </label>

          <div className="flex justify-between gap-3">
            <Link
              href="/request/profile"
              className="inline-flex h-[46px] items-center rounded-full border border-line-strongest bg-white px-6 font-sans text-sm font-semibold text-navy no-underline hover:border-brand hover:text-brand"
            >
              Back
            </Link>
            <button
              onClick={submit}
              className="inline-flex h-[46px] cursor-pointer items-center rounded-full border-none bg-brand px-7 font-sans text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Submit request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
