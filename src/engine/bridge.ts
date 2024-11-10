import { useCallback, useMemo, useRef } from "react";

export const useEventBridge = <T>() => {
  const subscribers = useRef(
    [] as Array<{
      selector: (state: T) => any;
      cachedResult: any;
      setResult: (result: any) => void;
    }>,
  );

  const subscribe = useCallback(
    <U>({
      selector,
      cachedResult,
      setResult,
    }: {
      selector: (state: T) => U;
      cachedResult: U;
      setResult: (result: U) => void;
    }) => {
      subscribers.current.push({ selector, cachedResult, setResult });
    },
    [],
  );

  const notify = useCallback((state: T) => {
    for (const subscriber of subscribers.current) {
      const { selector, cachedResult, setResult } = subscriber;
      const result = selector(state);
      if (result !== cachedResult) {
        subscriber.cachedResult = result;
        setResult(result);
      }
    }
  }, []);

  return useMemo(() => ({ subscribe, notify }), [subscribe, notify]);
};
