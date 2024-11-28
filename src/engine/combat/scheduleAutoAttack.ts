import { damageDealt } from "./actions";
import type {
  CombatEntity,
  CombatEngineState,
  ScheduledEvent,
} from "src/types/CombatEngine";

const canAct = (entity?: CombatEntity) => {
  return entity && entity.hp.current > 0;
};

export const scheduleAutoAttack = (
  attackerId: string,
  combatEngineState: { current: CombatEngineState },
  startedAt: number,
  pendingEvents: { current: Array<ScheduledEvent> },
) => {
  const swingDelay = 500;
  const runAt = startedAt + swingDelay;

  const run: ScheduledEvent["run"] = () => {
    const state = combatEngineState.current;
    const attacker = state.entities[attackerId];
    if (!canAct(attacker)) {
      console.log(`attacker: ${attackerId} cannot act`, state.entities);
      return [];
    }
    console.log(
      `${attacker.name}'s turn to swing (hp: ${attacker.hp.current})`,
    );

    // TODO better targeting
    const target = Object.values(state.entities).find(
      ({ type, hp: { current } }) => type !== attacker.type && current > 0,
    );

    if (target) {
      const { id: attackeeId } = target;
      const damage = 3;

      scheduleAutoAttack(attackerId, combatEngineState, runAt, pendingEvents);
      return [damageDealt({ attackeeId, attackerId, damage })];
    }

    return [];
  };

  pendingEvents.current.push({
    startedAt,
    runAt,
    run,
  });
};
