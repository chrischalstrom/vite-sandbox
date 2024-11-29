export const CombatMonsterPane = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="w-1/2 flex items-center gap-2 select-none">{children}</div>
  );
};

export default CombatMonsterPane;
