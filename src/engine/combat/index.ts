import { useCallback, useEffect, useMemo, useRef } from "react";
import { processEvents } from "./processEvents";
import { scheduleAutoAttack } from "./scheduleAutoAttack";

import type { Monster, Player, ScheduledEvent } from "src/types/CombatEngine";

// it might make more sense to normalize this data i.e.
// entities: { [entityId]: {type: 'monster', ...}}
// much cleaner lookups // fns etc.
const useInitialState = () => {
  return useMemo(() => {
    return {
      players: [
        {
          id: "jimmy",
          name: "jimmy",
          hp: { current: 81, max: 81 },
        },
        {
          id: "jed",
          name: "jed",
          hp: { current: 85, max: 85 },
        },
        {
          id: "zed",
          name: "zed",
          hp: { current: 91, max: 91 },
        },
        {
          id: "tedderonious",
          name: "tedderonious",
          hp: { current: 83, max: 83 },
        },
      ] as Player[],
      monsters: [
        {
          id: "goblin 1",
          name: "goblin 1",
          hp: { current: 34, max: 34 },
        },
        {
          id: "goblin 2",
          name: "goblin 2",
          hp: { current: 31, max: 31 },
        },
      ] as Monster[],
    };
  }, []);
};

// needs api for event ingress/egress
export const useCombatEngine = (
  notify: (state: { monsters: Monster[]; players: Player[] }) => void,
) => {
  const initialState = useInitialState();
  const state = useRef({
    monsters: initialState.monsters,
    players: initialState.players,
  });
  const getState = useCallback(() => state.current, []);

  const interval = useRef(0);
  const startTime = useRef(Date.now());
  const updates = useRef(0);

  const pendingEvents = useRef<Array<ScheduledEvent>>([]);

  // set up combat, starting with auto attacks
  const begin = useCallback(() => {
    const updateFrequencyMs = 50;
    interval.current = window.setInterval(() => {
      updates.current += 1;
      if (updates.current < 100) {
        const results = processEvents(pendingEvents);
        if (results.length > 0) {
          notify(state.current);
        }
      } else {
        console.log("maximum updates, clearing ...");
        clearInterval(interval.current);
      }
    }, updateFrequencyMs);

    for (const { id } of state.current.players) {
      scheduleAutoAttack(id, state, startTime.current, pendingEvents);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return useMemo(() => ({ getState, begin }), [getState, begin]);
};