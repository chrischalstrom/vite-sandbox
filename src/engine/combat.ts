import { useCallback, useEffect, useMemo, useRef } from "react";

import type { Monster, Player } from "src/types/CombatEngine";

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

/**
 * How I'm thinking that this works is we need a way to schedule callbacks at a given time:
 *   - Attack/weapon swings : each attacker (stats, items, effects, etc.)
 *     - autoAttackScheduler -> (entity, target)
 *   - spells, abilities, etc.
 */
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

  // later when we call notify, it seems insufficient to provide only the new state.
  // we'd have to go back and figure out the events that happened.
  // there should be a way to subscribe to events, not just state.
  // since we would want to show graphics and stuff when certain events happen,
  // not just reflect the latest ui.
  const takeDamage = useCallback(
    ({ entityId, dmg }: { entityId: string; dmg: number }) => {
      // const entity = ...
    },
    [],
  );

  const update = useCallback(() => {
    for (const player of state.current.players) {
      const { current, max } = player.hp;
      if (Math.random() < 0.5) {
        player.hp = { current: current - 3, max };
      }
    }

    notify(getState());
  }, [getState, notify]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return useMemo(() => ({ getState, update }), [getState, update]);
};

const processQueue = () => {
  const now = Date.now();
  const queue = [{ time: 1234, timeout: 4321, fn: () => {} }]
    .filter((event) => event.time <= now)
    .sort((a, b) => a.time - b.time);
  for (const { timeout, fn } of queue) {
    clearTimeout(timeout);
    fn();
  }
};

const swing = () => {
  // then = time of previous swing.
  const then = 1234;
  const now = Date.now();
  const weaponDelay = 1800;
  // now will generally be after then due to js lag on executing timeout fn
  // note: we might want to add some arbitrary time here like 20ms to batch up event processing more?
  const toElapse = now - then + weaponDelay;
  const queue = [];
  const fn = () => {
    // each entity probably needs fns -
    // getAutoAttackerData, getAutoAttackeeData...
    // to sum up stats + items + effects etc. and return usable data.
    // then also something like takeDamage fn.
    const attacker = "a";
    const attackee = "b";
    const toHitChance = 0.8;
    const critChance = 0.05;
    // some fn i.e. weapon dmg * armor reduction * ability reduction...
    const dmg = 7 * 0.9 * 0.9;
    // takeDamage(attackee)
  };
  const timeout = setTimeout(fn, toElapse);
  queue.push({
    time: then + weaponDelay,
    timeout,
    fn,
  });
};
