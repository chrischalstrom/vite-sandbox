import type { damageDealt } from "./actions";

import type { CombatEngineState, ScheduledEvent } from "src/types/CombatEngine";

const handleDamageDealt = (
  state: { current: CombatEngineState },
  { attackeeId, attackerId, damage }: ReturnType<typeof damageDealt>["payload"],
) => {
  const attacker = state.current.entities[attackerId];
  if (!attacker) {
    console.error(
      `attacker: ${attackerId} not found in state: ${state.current.entities}`,
    );
    return;
  }

  const attackee = state.current.entities[attackeeId];
  if (!attackee) {
    console.error(
      `attackee: ${attackeeId} not found in state: ${state.current.entities}`,
    );
    return;
  }

  const {
    hp: { current, max },
  } = attackee;
  attackee.hp = { current: Math.max(0, current - damage), max };
};

export const mutate = (
  state: { current: CombatEngineState },
  runResults: ReturnType<ScheduledEvent["run"]>,
) => {
  for (const { type, payload } of runResults) {
    if (type === "combat.damage_dealt") {
      handleDamageDealt(state, payload);
    }
  }
};
