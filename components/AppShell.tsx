'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import EvoShopFooter from './EvoShopFooter';
import EvoShopNav from './EvoShopNav';
import RequestDrawer from './RequestDrawer';
import { RequestListProvider } from './RequestListContext';

/** The fixed 1440px desktop frame — canvas shows outside it (README §3).
    There is deliberately no responsive layout for this regulated pharmacy UI. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The wizard steps render without the footer in the references; the
  // confirmation screen brings it back.
  const hideFooter = pathname.startsWith('/request') && pathname !== '/request/confirmation';

  return (
    <RequestListProvider>
      <div className="relative mx-auto flex min-h-screen w-frame flex-col bg-white">
        <Suspense fallback={null}>
          <EvoShopNav />
        </Suspense>
        <main className="flex flex-1 flex-col">{children}</main>
        {!hideFooter && <EvoShopFooter />}
      </div>
      <RequestDrawer />
    </RequestListProvider>
  );
}
