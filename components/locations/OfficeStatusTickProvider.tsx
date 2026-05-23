"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Tick = Date | null;

// `undefined` sentinel distinguishes "no provider mounted" from
// "provider mounted but pre-first-tick" (which is `null`).
const OfficeStatusTickContext = createContext<Tick | undefined>(undefined);

export function OfficeStatusTickProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Tick>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <OfficeStatusTickContext.Provider value={now}>{children}</OfficeStatusTickContext.Provider>
  );
}

// Returns the current Date. When a Provider is mounted in an ancestor, all
// consumers share its single interval. When no Provider is present (e.g. a
// standalone status banner on the detail page), the hook runs its own minimal
// interval so usage stays drop-in. SSR returns `null` either way to avoid
// timezone mismatch.
export function useOfficeStatusTick(): Tick {
  const ctx = useContext(OfficeStatusTickContext);
  const hasProvider = ctx !== undefined;
  const [standalone, setStandalone] = useState<Tick>(null);

  useEffect(() => {
    if (hasProvider) return;
    setStandalone(new Date());
    const id = window.setInterval(() => setStandalone(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, [hasProvider]);

  return hasProvider ? (ctx as Tick) : standalone;
}
