import { createContext, useEffect, useMemo } from "react";

import { useEventBridge } from "src/engine/bridge";
import { useCombatEngine } from "src/engine/combat";

import type { CombatEngineState } from "src/types/CombatEngine";

export const CombatEngineContext = createContext<{
  getState: () => CombatEngineState;
  subscribe: ({
    selector,
    cachedResult,
    setResult,
  }: {
    selector: (state: CombatEngineState) => any;
    cachedResult: any;
    setResult: (result: any) => void;
  }) => void;
}>({
  getState: () => {
    console.error(
      "Error: Called CombatEngineContext.getState without provider",
    );

    return {
      entities: {},
    };
  },
  subscribe: () => {
    console.error(
      "Error: Called CombatEngineContext.subscribe without provider",
    );
  },
});
const { Provider } = CombatEngineContext;

export const CombatEngineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { subscribe, notify } = useEventBridge<CombatEngineState>();
  const { getState, begin } = useCombatEngine(notify);

  useEffect(() => {
    console.log("ticking game engine state...");
    begin();
  }, []);

  const value = useMemo(() => ({ getState, subscribe }), [getState, subscribe]);

  return <Provider value={value}>{children}</Provider>;
};

export default CombatEngineProvider;
