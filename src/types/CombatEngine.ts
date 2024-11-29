import type { CombatActions } from "src/engine/combat/actions";

export type CombatEntity<
  T extends "monster" | "player" = "monster" | "player",
> = {
  id: string;
  name: string;
  hp: { current: number; max: number };
  type: T;
};

export type Monster = CombatEntity<"monster">;
export type Player = CombatEntity<"player">;

export type CombatEngineState = {
  entities: Record<string, CombatEntity>;
};

export type DispatchableEvent = CombatActions;

export type ScheduledEvent = {
  startedAt: number;
  runAt: number;
  run: () => DispatchableEvent[];
};
