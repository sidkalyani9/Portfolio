import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type BootContextValue = {
  booted: boolean;
  complete: () => void;
};

const BootContext = createContext<BootContextValue>({
  booted: false,
  complete: () => {},
});

export function BootProvider({ children }: { children: ReactNode }) {
  const [booted, setBooted] = useState(false);
  const value = useMemo(
    () => ({ booted, complete: () => setBooted(true) }),
    [booted],
  );
  return <BootContext.Provider value={value}>{children}</BootContext.Provider>;
}

/** True once the boot sequence has finished and the hero may stream. */
export function useBooted() {
  return useContext(BootContext).booted;
}

/** Marks the boot sequence complete — used by the preloader only. */
export function useBootComplete() {
  return useContext(BootContext).complete;
}
