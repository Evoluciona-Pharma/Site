'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { RequestItem } from '@/components/RequestListContext';

export type WizardData = {
  // Step 1 · Contact
  name: string;
  role: string;
  email: string;
  phone: string;
  license: string;
  licensedState: string;
  // Step 2 · Practice
  practiceName: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  // Step 3 · Profile
  practiceType: string;
  interests: string[] | null; // null = not initialized yet (seeded from the request list)
  // Step 4 · Additional
  message: string;
  hearAbout: string;
  attestation: boolean;
};

export type Submitted = {
  reference: string;
  items: RequestItem[];
};

const EMPTY: WizardData = {
  name: '',
  role: '',
  email: '',
  phone: '',
  license: '',
  licensedState: '',
  practiceName: '',
  website: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  practiceType: '',
  interests: null,
  message: '',
  hearAbout: '',
  attestation: false,
};

type WizardValue = {
  data: WizardData;
  update: (patch: Partial<WizardData>) => void;
  submitted: Submitted | null;
  setSubmitted: (s: Submitted) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardValue | null>(null);

const STORAGE_KEY = 'evo-request-wizard';

export function RequestWizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WizardData>(EMPTY);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) setData({ ...EMPTY, ...parsed.data });
        if (parsed?.submitted) setSubmitted(parsed.submitted);
      }
    } catch {
      /* start clean */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, submitted }));
    } catch {
      /* storage unavailable */
    }
  }, [data, submitted]);

  const update = (patch: Partial<WizardData>) => setData((d) => ({ ...d, ...patch }));
  const reset = () => setData(EMPTY);

  return (
    <WizardContext.Provider value={{ data, update, submitted, setSubmitted, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside RequestWizardProvider');
  return ctx;
}
