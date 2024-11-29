export const CombatPlayerPane = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="absolute bottom-0 w-full flex gap-2 select-none">
      {children}
    </div>
  );
};

export default CombatPlayerPane;
