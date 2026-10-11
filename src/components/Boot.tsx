import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { rememberIntro, shouldPlayIntro } from "@/lib/intro";

type BootContextValue = {
  booted: boolean;
  introVisible: boolean;
  reveal: () => void;
  finish: () => void;
};

const BootContext = createContext<BootContextValue>({
  booted: false,
  introVisible: false,
  reveal: () => {},
  finish: () => {},
});

export function BootProvider({ children }: { children: ReactNode }) {
  const [introVisible, setIntroVisible] = useState(shouldPlayIntro);
  const [booted, setBooted] = useState(!introVisible);
  const reveal = useCallback(() => setBooted(true), []);
  const finish = useCallback(() => {
    rememberIntro();
    setBooted(true);
    setIntroVisible(false);
  }, []);
  const value = useMemo(
    () => ({ booted, introVisible, reveal, finish }),
    [booted, introVisible, reveal, finish],
  );
  return <BootContext.Provider value={value}>{children}</BootContext.Provider>;
}

/** Starts the hero while the introduction is revealing the page. */
export function useBooted() {
  return useContext(BootContext).booted;
}

export function useIntroControls() {
  return useContext(BootContext);
}

/** Keep obscured controls out of the keyboard and accessibility tree. */
export function IntroContent({ children }: { children: ReactNode }) {
  const { introVisible } = useIntroControls();
  return (
    <div data-intro-content inert={introVisible} aria-hidden={introVisible || undefined}>
      {children}
    </div>
  );
}
