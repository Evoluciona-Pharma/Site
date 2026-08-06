'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
    if (Object.keys(e).length === 0) router.push('/request/practice');
  };

  const errorList = Object.values(errors);

  return (
    <div className="flex flex-1 flex-col bg-surface-form">
      <div className="flex justify-center pb-[76px] pt-11">
        <div className="flex w-form flex-col gap-[26px]">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[40px] leading-none text-navy">Request Product Information</h2>
            <span className="text-sm text-muted">
              A representative will follow up with program details. No pricing is shown online.
            </span>
          </div>
          <StepperFull current={1} />
          <div className="grid grid-cols-[1fr_380px] items-start gap-7">
            <div className="flex flex-col gap-4">
              {errorList.length > 0 && <ErrorBanner count={errorList.length} detail={errorList[0]} />}
              <Reveal delay={100} className="flex flex-col gap-[22px] rounded-2xl border border-line bg-white p-8">
                <span className="font-display text-[26px] text-navy">Primary contact</span>
                <div className="grid grid-cols-2 gap-[18px]">
                  <TextField label="Name" value={data.name} onChange={set('name')} error={errors.name} />
                  <TextField label="Role" value={data.role} onChange={set('role')} />
                  <TextField label="Email" type="email" value={data.email} onChange={set('email')} error={errors.email} />
                  <TextField label="Phone" type="tel" value={data.phone} onChange={set('phone')} placeholder="(000) 000-0000" />
                  <TextField
                    label="License / NPI number"
                    value={data.license}
                    onChange={set('license')}
                    error={errors.license}
                    placeholder="Required for verification"
                  />
                  <SelectField
                    label="Licensed state"
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
