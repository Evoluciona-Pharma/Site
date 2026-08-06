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

  const add = useCallback((item: RequestItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        // Never duplicate — adding an existing item updates its presentation instead.
        return prev.map((i) => (i.name === item.name ? { ...i, presentation: item.presentation } : i));
      }
      return [...prev, item];
    });
    setDrawerOpen(true);
  }, []);

  const remove = useCallback((name: string) => {
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
    </RequestListContext.Provider>
  );
}

export function useRequestList(): RequestListValue {
  const ctx = useContext(RequestListContext);
  if (!ctx) throw new Error('useRequestList must be used inside RequestListProvider');
  return ctx;
}
