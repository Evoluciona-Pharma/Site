'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { ErrorBanner, SelectField, TextField, US_STATES } from '@/components/request/fields';
import RequestSummaryRail from '@/components/request/RequestSummaryRail';
import { useWizard, WizardData } from '@/components/request/RequestWizardContext';
import { StepperFull } from '@/components/request/steppers';

export default function PracticeStep() {
  const router = useRouter();
  const { data, update } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof WizardData) => (v: string) => {
    update({ [key]: v });
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.practiceName.trim()) e.practiceName = 'Practice or company name is required';
    if (!data.address.trim()) e.address = 'Address is required';
    if (!data.city.trim()) e.city = 'City is required';
    if (!data.state) e.state = 'State is required';
    if (!data.zip.trim()) e.zip = 'ZIP code is required';
    else if (!/^\d{5}$/.test(data.zip.trim())) e.zip = 'Enter a 5-digit ZIP code';
    return e;
  };

  const onContinue = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) router.push('/request/profile');
  };

  const errorList = Object.values(errors);

  return (
    <div className="flex flex-1 flex-col bg-surface-form">
      <div className="flex justify-center pb-[76px] pt-11">
        <div className="flex w-form flex-col gap-[26px]">
          <h2 className="text-[40px] leading-none text-navy">Request Product Information</h2>
          <StepperFull current={2} />
          <div className="grid grid-cols-[1fr_380px] items-start gap-7">
            <div className="flex flex-col gap-4">
              {errorList.length > 0 && <ErrorBanner count={errorList.length} detail={errorList[0]} />}
              <Reveal delay={100} className="flex flex-col gap-[22px] rounded-2xl border border-line bg-white p-8">
                <span className="font-display text-[26px] text-navy">Practice information</span>
                <div className="grid grid-cols-2 gap-[18px]">
                  <TextField
                    label="Practice or company name"
                    value={data.practiceName}
                    onChange={set('practiceName')}
                    error={errors.practiceName}
                    placeholder="Required"
                  />
                  <TextField label="Website" value={data.website} onChange={set('website')} />
                </div>
                <TextField label="Address" value={data.address} onChange={set('address')} error={errors.address} />
                <div className="grid grid-cols-[2fr_1.4fr_1fr] gap-[18px]">
                  <TextField label="City" value={data.city} onChange={set('city')} error={errors.city} />
                  <SelectField
                    label="State"
                    value={data.state}
                    onChange={set('state')}
                    options={US_STATES}
                    error={errors.state}
                  />
                  <TextField label="ZIP code" value={data.zip} onChange={set('zip')} error={errors.zip} />
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <Link
                    href="/request/contact"
                    className="inline-flex h-12 items-center rounded-full border border-line-strongest bg-white px-[26px] font-sans text-sm font-semibold text-navy no-underline hover:border-brand hover:text-brand"
                  >
                    Back
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
            <RequestSummaryRail full={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
