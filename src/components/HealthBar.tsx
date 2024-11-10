export const HealthBar = ({
  current,
  max,
}: {
  current: number;
  max: number;
}) => {
  return (
    <div>
      hp: {current} / {max}
    </div>
  );
};

export default HealthBar;
