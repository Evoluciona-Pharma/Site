'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import { ErrorBanner, SelectField, TextField, US_STATES } from '@/components/request/fields';
import RequestSummaryRail from '@/components/request/RequestSummaryRail';
import { useWizard, WizardData } from '@/components/request/RequestWizardContext';
import { StepperFull } from '@/components/request/steppers';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactStep() {
  const router = useRouter();
  const { data, update } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Counter rather than a flag: re-submitting with the same errors still moves
  // focus, so the alert is re-announced on every attempt.
  const [failedAttempts, setFailedAttempts] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (failedAttempts > 0) bannerRef.current?.focus();
  }, [failedAttempts]);

  const set = (key: keyof WizardData) => (v: string) => {
    update({ [key]: v });
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = 'Name is required';
    if (!data.email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(data.email.trim())) e.email = 'Enter a valid email address';
    if (!data.license.trim()) e.license = 'License / NPI number is required';
    if (!data.licensedState) e.licensedState = 'Licensed state is required';
    return e;
  };

  const onContinue = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      router.push('/request/practice');
      return;
    }
    setFailedAttempts((n) => n + 1);
  };

  const errorList = Object.values(errors);

  return (
    <div className="flex flex-1 flex-col bg-surface-form">
      <div className="flex justify-center px-4 pb-[76px] pt-11 sm:px-6 xl:px-0">
        <div className="flex w-full max-w-form flex-col gap-[26px]">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[30px] leading-none text-navy lg:text-[40px]">Request Product Information</h2>
            <span className="text-sm text-muted">
              A representative will follow up with program details. No pricing is shown online.
            </span>
          </div>
          <StepperFull current={1} />
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-4">
              {errorList.length > 0 && (
                <ErrorBanner ref={bannerRef} count={errorList.length} detail={errorList[0]} />
              )}
              <Reveal delay={100} className="flex flex-col gap-[22px] rounded-2xl border border-line bg-white p-5 sm:p-8">
                <span className="font-display text-[26px] text-navy">Primary contact</span>
                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                  <TextField
                    label="Name"
                    name="name"
                    autoComplete="name"
                    required
                    value={data.name}
                    onChange={set('name')}
                    error={errors.name}
                  />
                  <TextField
                    label="Role"
                    name="role"
                    autoComplete="organization-title"
                    value={data.role}
                    onChange={set('role')}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={data.email}
                    onChange={set('email')}
                    error={errors.email}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={set('phone')}
                    placeholder="(000) 000-0000"
                  />
                  <TextField
                    label="License / NPI number"
                    name="license"
                    required
                    value={data.license}
                    onChange={set('license')}
                    error={errors.license}
                    placeholder="Required for verification"
                  />
                  <SelectField
                    label="Licensed state"
                    name="licensedState"
                    required
                    value={data.licensedState}
                    onChange={set('licensedState')}
                    options={US_STATES}
                    error={errors.licensedState}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <Link href="/shop" className="text-[13px] font-semibold no-underline">
                    ‹ Back to catalog
                  </Link>
                  <button
                    onClick={onContinue}
                    className="inline-flex h-12 cursor-pointer items-center rounded-full border-none bg-brand px-8 font-sans text-sm font-semibold text-white hover:bg-brand-hover"
                  >
                    Continue
                  </button>
                </div>
              </Reveal>
            </div>
            <RequestSummaryRail full />
          </div>
        </div>
      </div>
    </div>
  );
}
