import { mutate } from "./mutations";
import type { CombatEngineState, ScheduledEvent } from "src/types/CombatEngine";

export const processEvents = (
  combatEngineState: { current: CombatEngineState },
  pendingEvents: {
    current: Array<ScheduledEvent>;
  },
) => {
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
    const runResults = run();

    mutate(combatEngineState, runResults);

    results.push(...runResults);
  }

  return results;
};
