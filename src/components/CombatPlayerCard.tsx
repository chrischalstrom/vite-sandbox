import { useCombatEngineState } from "src/hooks/useCombatEngineState";
import {
  selectEntityHealth,
  selectEntityName,
} from "src/selectors/selectCombatEntity";

import { CombatCard } from "src/components/CombatCard";
import { HealthBar } from "src/components/HealthBar";

export const CombatPlayerCard = ({ entityId }: { entityId: string }) => {
  const name = useCombatEngineState(selectEntityName(entityId, "players"));
  const { current, max } = useCombatEngineState(
    selectEntityHealth(entityId, "players"),
  );

  return (
    <div className="flex-1">
      <CombatCard>{name}</CombatCard>
      <HealthBar current={current} max={max} />
    </div>
  );
};

export default CombatPlayerCard;
