import type { ScheduledEvent } from "src/types/CombatEngine";

export const processEvents = (pendingEvents: {
  current: Array<ScheduledEvent>;
}) => {
  const now = Date.now();
  const events = pendingEvents.current
    .filter(({ runAt }) => runAt <= now)
    .sort((a, b) => a.runAt - b.runAt);

  const results = [];

  for (const event of events) {
    pendingEvents.current = pendingEvents.current.filter(
      (pending) => pending !== event,
    );
    const { run } = event;
    results.push(...run());
  }

  return results;
};
