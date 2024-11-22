import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import "@testing-library/dom";
import Title from "./Title";

describe("Title page", () => {
  it("renders", async () => {
    const { getByText } = render(<Title />);
    await expect.element(getByText("My game")).toBeInTheDocument();
  });
});
