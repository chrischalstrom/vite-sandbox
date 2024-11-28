import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import "@testing-library/dom";

import { CombatMonsterCard } from "./CombatMonsterCard";
import { CombatEngineProvider } from "src/contexts/CombatEngine";

describe("components.CombatMonsterCard", () => {
  it("renders", async () => {
    const { getByText } = render(<CombatMonsterCard entityId="goblin 1" />, {
      wrapper: ({ children }) => (
        <CombatEngineProvider>{children}</CombatEngineProvider>
      ),
    });
    await expect.element(getByText("goblin 1")).toBeInTheDocument();
  });

  it("does not render if entity not found", async () => {
    const { getByTestId } = render(
      <CombatMonsterCard entityId="does not exist" />,
      {
        wrapper: ({ children }) => (
          <CombatEngineProvider>{children}</CombatEngineProvider>
        ),
      },
    );
    await expect
      .element(getByTestId("combat-monster-card"))
      .not.toBeInTheDocument();
  });
});
