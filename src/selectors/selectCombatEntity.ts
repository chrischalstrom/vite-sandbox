import type { CombatEngineState } from "src/types/CombatEngine";

const selectCombatEntity = ({
  entityId,
  state,
}: {
  entityId: string;
  state: CombatEngineState;
}) => state.entities[entityId];

export const selectEntityHealth =
  ({ entityId }: { entityId: string }) =>
  (state: CombatEngineState) =>
    selectCombatEntity({ entityId, state })?.hp || {
      current: 0,
      max: 0,
    };

export const selectEntityName =
  ({ entityId }: { entityId: string }) =>
  (state: CombatEngineState) =>
    selectCombatEntity({ entityId, state })?.name || "not_found";

export const selectCombatEngineState = (state: CombatEngineState) => state;
