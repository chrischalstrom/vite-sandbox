export const damageDealt = ({
  attackerId,
  attackeeId,
  damage,
}: {
  attackerId: string;
  attackeeId: string;
  damage: number;
}) =>
  ({
    type: "combat.damage_dealt",
    payload: {
      attackerId,
      attackeeId,
      damage,
    },
  }) as const;

export type CombatActions = ReturnType<typeof damageDealt>;
