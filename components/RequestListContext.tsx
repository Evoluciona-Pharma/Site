'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type RequestItem = {
  name: string;
  program: string;
  /** null when the presentation is pending pharmacy confirmation (MOTS-C). */
  presentation: string | null;
};

type RequestListValue = {
  items: RequestItem[];
  count: number;
  drawerOpen: boolean;
  add: (item: RequestItem) => void;
  remove: (name: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const RequestListContext = createContext<RequestListValue | null>(null);

const STORAGE_KEY = 'evo-request-list';

export function RequestListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hydrated = useRef(false);
  // Adding an item was previously silent for screen-reader users — the drawer
  // slides in and the nav badge ticks up, neither of which is announced. The
  // message is staged here and completed with the new count in an effect, so
  // the state updater itself stays pure.
  const [announcement, setAnnouncement] = useState('');
  const pendingAnnouncement = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* corrupted storage — start empty */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  useEffect(() => {
    if (pendingAnnouncement.current === null) return;
    const message = pendingAnnouncement.current;
    pendingAnnouncement.current = null;
    setAnnouncement(`${message} ${items.length} ${items.length === 1 ? 'item' : 'items'} in list.`);
  }, [items]);

  const add = useCallback((item: RequestItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      pendingAnnouncement.current = existing
        ? `${item.name} updated in your request list.`
        : `${item.name} added to your request list.`;
      if (existing) {
        // Never duplicate — adding an existing item updates its presentation instead.
        return prev.map((i) => (i.name === item.name ? { ...i, presentation: item.presentation } : i));
      }
      return [...prev, item];
    });
    setDrawerOpen(true);
  }, []);

  const remove = useCallback((name: string) => {
    pendingAnnouncement.current = `${name} removed from your request list.`;
    setItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <RequestListContext.Provider
      value={{ items, count: items.length, drawerOpen, add, remove, clear, openDrawer, closeDrawer }}
    >
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </RequestListContext.Provider>
  );
}

export function useRequestList(): RequestListValue {
  const ctx = useContext(RequestListContext);
  if (!ctx) throw new Error('useRequestList must be used inside RequestListProvider');
  return ctx;
}
