import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { damageDealt } from "./actions";
import { processEvents } from "./processEvents";
import type { DispatchableEvent, ScheduledEvent } from "src/types/CombatEngine";

describe("engine.combat.processEvents", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an empty array if events are empty", () => {
    const pendingEvents = { current: [] };
    const results = processEvents(pendingEvents);
    expect(results).toEqual([]);
  });

  it("does not process events if they should run in the future", () => {
    vi.setSystemTime(1000);
    const events: Array<ScheduledEvent> = [
      {
        startedAt: 1000,
        runAt: 1001,
        run: vi.fn().mockReturnValue([]),
      },
      {
        startedAt: 1000,
        runAt: 2000,
        run: vi.fn().mockReturnValue([]),
      },
    ];

    const pendingEvents = { current: [...events] };
    const results = processEvents(pendingEvents);
    expect(results).toEqual([]);
    expect(pendingEvents.current.length).toBe(2);
    expect(events[0].run).not.toHaveBeenCalled();
    expect(events[1].run).not.toHaveBeenCalled();
  });

  it("processes events in order if they should run at or before now", () => {
    vi.setSystemTime(1000);
    const eventData: DispatchableEvent[][] = [
      [
        damageDealt({
          attackeeId: "event[0].attackee",
          attackerId: "event[0].attacker",
          damage: 1,
        }),
      ],
      [
        damageDealt({
          attackeeId: "event[1].attackee",
          attackerId: "event[1].attacker",
          damage: 2,
        }),
        damageDealt({
          attackeeId: "event[2].attackee",
          attackerId: "event[2].attacker",
          damage: 3,
        }),
      ],
      [
        damageDealt({
          attackeeId: "event[3].attackee",
          attackerId: "event[3].attacker",
          damage: 4,
        }),
      ],
    ];
    const events: Array<ScheduledEvent> = [
      {
        startedAt: 500,
        runAt: 2000,
        run: vi.fn().mockReturnValue(eventData[0]),
      },
      {
        startedAt: 500,
        runAt: 1000,
        run: vi.fn().mockReturnValue(eventData[1]),
      },
      {
        startedAt: 500,
        runAt: 900,
        run: vi.fn().mockReturnValue(eventData[2]),
      },
    ];

    const pendingEvents = { current: [...events] };
    const results = processEvents(pendingEvents);
    expect(results).toEqual([
      damageDealt({
        attackeeId: "event[3].attackee",
        attackerId: "event[3].attacker",
        damage: 4,
      }),
      damageDealt({
        attackeeId: "event[1].attackee",
        attackerId: "event[1].attacker",
        damage: 2,
      }),
      damageDealt({
        attackeeId: "event[2].attackee",
        attackerId: "event[2].attacker",
        damage: 3,
      }),
    ]);
    expect(pendingEvents.current.length).toBe(1);
    expect(events[0].run).not.toHaveBeenCalled();
    expect(events[1].run).toHaveBeenCalled();
    expect(events[2].run).toHaveBeenCalled();
  });
});
