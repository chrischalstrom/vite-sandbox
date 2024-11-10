/**
 * I think this probably shouldn't be pos: absolute because
 * we don't want it to overlap with the monster pane.
 *  -------
 * |       |
 * |   M   |
 * | ----- |
 * | p p p |
 *  -------
 * @param param0
 * @returns
 */
export const CombatPlayerPane = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex gap-2">{children}</div>;
};

export default CombatPlayerPane;
