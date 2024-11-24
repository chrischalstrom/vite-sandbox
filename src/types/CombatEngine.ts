type CombatEntity = {
  id: string;
  name: string;
  hp: { current: number; max: number };
};

export type Monster = CombatEntity;
export type Player = CombatEntity;

export type CombatEngineState = {
  monsters: Monster[];
  players: Player[];
};
