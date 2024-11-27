import { useCallback, useEffect, useMemo, useRef } from "react";

import type {
  CombatEngineState,
  Monster,
  Player,
} from "src/types/CombatEngine";

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

// starting to look like redux o_O
type DispatchableEvent = {
  type: "combat.damage_dealt";
  payload: {
    attackerId: string;
    attackeeId: string;
    damage: number;
  };
};

type ScheduledEvent = {
  startedAt: number;
  runAt: number;
  run: () => DispatchableEvent[];
};

const scheduleAutoAttack = (
  attackerId: string,
  combatEngineState: { current: CombatEngineState },
  startedAt: number,
  pendingEvents: { current: Array<ScheduledEvent> },
) => {
  const swingDelay = 500;
  const runAt = startedAt + swingDelay;

  const run: ScheduledEvent["run"] = () => {
    const state = combatEngineState.current;
    const player = state.players.find(({ id }) => attackerId === id);
    if (!player) {
      console.error("player not found", attackerId, state.players);
      return [];
    }
    console.log(`${player.name}'s turn to swing`);
    const target = state.monsters.find(({ hp: { current } }) => current > 0);

    // TODO: better to change state elsewhere in a more centralized way.
    // i.e. by reading return array.
    if (target) {
      const {
        id: attackeeId,
        hp: { current, max },
      } = target;
      const damage = 3;
      target.hp = { current: Math.max(0, current - damage), max };

      scheduleAutoAttack(attackerId, combatEngineState, runAt, pendingEvents);
      return [
        {
          type: "combat.damage_dealt",
          payload: {
            attackerId,
            attackeeId,
            damage,
          },
        },
      ];
    }

    return [];
  };

  pendingEvents.current.push({
    startedAt,
    runAt,
    run,
  });
};

const processEvents = (pendingEvents: { current: Array<ScheduledEvent> }) => {
  const now = Date.now();
  const events = pendingEvents.current
    .filter(({ runAt }) => runAt <= now)
    .sort((a, b) => a.runAt - b.runAt);

  const results = [];

  for (const event of events) {
    pendingEvents.current = pendingEvents.current.filter(
      (pending) => pending !== event,
    );
    const { run } = event;
    results.push(...run());
  }

  return results;
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

  const timeout = useRef(0);
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
      clearTimeout(timeout.current);
      clearInterval(interval.current);
    };
  }, []);

  return useMemo(() => ({ getState, begin }), [getState, begin]);
};
