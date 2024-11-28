import { CombatMonsterCard } from "src/components/CombatMonsterCard";
import { CombatPlayerCard } from "src/components/CombatPlayerCard";
import { CombatPlayerPane } from "src/components/CombatPlayerPane";
import { CombatEngineProvider } from "src/contexts/CombatEngine";

import { useCombatEngineState } from "src/hooks/useCombatEngineState";
import { selectCombatEngineState } from "src/selectors/selectCombatEntity";

const CombatInner = () => {
  const { entities } = useCombatEngineState(selectCombatEngineState);
  const monsters = Object.values(entities).filter(
    ({ type }) => type === "monster",
  );
  const players = Object.values(entities).filter(
    ({ type }) => type === "player",
  );

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div>
        {monsters.map(({ id }) => (
          <CombatMonsterCard key={id} entityId={id} />
        ))}
      </div>
      <CombatPlayerPane>
        {players.map(({ id }) => (
          <CombatPlayerCard key={id} entityId={id} />
        ))}
      </CombatPlayerPane>
    </div>
  );
};

export const Combat = () => {
  return (
    <CombatEngineProvider>
      <CombatInner />
    </CombatEngineProvider>
  );
};

export default Combat;
