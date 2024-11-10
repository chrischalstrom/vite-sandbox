import { useContext, useEffect, useMemo, useState } from "react";
import { CombatEngineContext } from "src/contexts/CombatEngine";

import type { CombatEngineState } from "src/types/CombatEngine";

/**
 * Optimized way to fire micro-updates instead of invalidating the whole tree
 * based on one slice of state from selector
 * @param selector fn yielding slice of game engine state.  Must be memoized to work efficiently
 * @returns result of selector fn
 */
export const useCombatEngineState = <T>(
  selector: (state: CombatEngineState) => T,
) => {
  const { getState, subscribe } = useContext(CombatEngineContext);

  const selected = useMemo(() => selector(getState()), []);
  const [result, setResult] = useState(selected);

  useEffect(() => {
    subscribe({ selector, cachedResult: selected, setResult });
  }, [subscribe]);

  return result;
};
