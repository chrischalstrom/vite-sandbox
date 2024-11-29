import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import "@testing-library/dom";

import { CombatPlayerCard } from "./CombatPlayerCard";
import { CombatEngineProvider } from "src/contexts/CombatEngine";

describe("components.CombatPlayerCard", () => {
  it("renders", async () => {
    const { getByText } = render(<CombatPlayerCard entityId="jimmy" />, {
      wrapper: ({ children }) => (
        <CombatEngineProvider>{children}</CombatEngineProvider>
      ),
    });
    await expect.element(getByText("jimmy")).toBeInTheDocument();
  });

  it("does not render if entity not found", async () => {
    const { getByTestId } = render(
      <CombatPlayerCard entityId="does not exist" />,
      {
        wrapper: ({ children }) => (
          <CombatEngineProvider>{children}</CombatEngineProvider>
        ),
      },
    );
    await expect
      .element(getByTestId("combat-player-card"))
      .not.toBeInTheDocument();
  });
});
