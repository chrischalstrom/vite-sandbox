import { useCombatEngineState } from "src/hooks/useCombatEngineState";
import {
  selectEntityHealth,
  selectEntityName,
} from "src/selectors/selectCombatEntity";

import { CombatCard } from "src/components/CombatCard";
import { HealthBar } from "src/components/HealthBar";

export const CombatPlayerCard = ({ entityId }: { entityId: string }) => {
  const name = useCombatEngineState(selectEntityName({ entityId }));
  const { current, max } = useCombatEngineState(
    selectEntityHealth({ entityId }),
  );

  if (!name) {
    return null;
  }

  return (
    <div className="flex-1" data-testid="combat-player-card">
      <CombatCard>{name}</CombatCard>
      <HealthBar current={current} max={max} />
    </div>
  );
};

export default CombatPlayerCard;
