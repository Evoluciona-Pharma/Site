'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { compliance } from '@/lib/catalog';
import { useRequestList } from '@/components/RequestListContext';
import { CheckboxField, ErrorBanner, SelectField } from '@/components/request/fields';
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
  const [failedAttempts, setFailedAttempts] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const messageId = useId();

  useEffect(() => {
    if (failedAttempts > 0) bannerRef.current?.focus();
  }, [failedAttempts]);

  const submit = () => {
    if (!data.attestation) {
      setError(true);
      setFailedAttempts((n) => n + 1);
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

          {error && (
            <ErrorBanner ref={bannerRef} count={1} detail="The provider attestation is required" />
          )}

          <div className="flex flex-col gap-[7px]">
            <label htmlFor={messageId} className="text-[13px] font-semibold text-navy">
              Message or special requirements
            </label>
            <textarea
              id={messageId}
              name="message"
              value={data.message}
              onChange={(e) => update({ message: e.target.value })}
              placeholder="Optional. Share program context, expected volume, or questions for the pharmacy team."
              className="h-[118px] resize-none rounded-[10px] border border-line-strong px-[15px] py-3 text-body text-navy outline-none placeholder:text-muted-3 focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <SelectField
            label="How did you hear about Evoluciona Pharma?"
            name="hearAbout"
            value={data.hearAbout}
            onChange={(v) => update({ hearAbout: v })}
            options={HEAR_ABOUT}
          />

          <CheckboxField
            checked={data.attestation}
            error={error}
            onChange={(v) => {
              update({ attestation: v });
              setError(false);
            }}
          >
            {compliance.attestation}
          </CheckboxField>

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
