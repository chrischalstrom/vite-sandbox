import type { CombatEngineState, ScheduledEvent } from "src/types/CombatEngine";

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
