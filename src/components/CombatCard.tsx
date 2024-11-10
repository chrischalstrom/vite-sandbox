export const CombatCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex p-2 justify-center border-2 border-sky-600 active:bg-blue-900 rounded-md cursor-pointer">
      {children}
    </div>
  );
};

export default CombatCard;
