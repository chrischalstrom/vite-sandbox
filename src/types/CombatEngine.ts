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

export type DispatchableEvent = {
  type: "combat.damage_dealt";
  payload: {
    attackerId: string;
    attackeeId: string;
    damage: number;
  };
};

export type ScheduledEvent = {
  startedAt: number;
  runAt: number;
  run: () => DispatchableEvent[];
};
