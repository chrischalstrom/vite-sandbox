import type { CombatEngineState } from "src/types/CombatEngine";

type EntityType = "players" | "monsters";

const selectCombatEntity = (
  entityId: string,
  entityType: EntityType,
  state: CombatEngineState,
) => state[entityType].find((e) => e.id === entityId);

export const selectEntityHealth =
  (entityId: string, entityType: EntityType) => (state: CombatEngineState) =>
    selectCombatEntity(entityId, entityType, state)?.hp || {
      current: 0,
      max: 0,
    };

export const selectEntityName =
  (entityId: string, entityType: EntityType) => (state: CombatEngineState) =>
    selectCombatEntity(entityId, entityType, state)?.name || "not_found";

export const selectCombatEngineState = (state: CombatEngineState) => state;
