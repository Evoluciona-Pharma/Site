import { RequestWizardProvider } from '@/components/request/RequestWizardContext';

export default function RequestLayout({ children }: { children: React.ReactNode }) {
  return <RequestWizardProvider>{children}</RequestWizardProvider>;
}
