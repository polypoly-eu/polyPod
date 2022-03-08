import {
  LegendEntry,
  Legend,
  IncorrectLegendEntry,
} from "../../src/react-components/legends/legend.js";

describe("LegendEntries work", () => {
  it("Creates a legendEntry", () => {
    const noColor = "#000000";
    const noColorStr = "No color";
    const legendEntry = new LegendEntry(noColorStr, noColor);
    expect(legendEntry).toBeTruthy;
    expect(legendEntry).toBeInstanceOf(LegendEntry);
    expect(legendEntry.color).toBe(noColor);
    expect(legendEntry.description).toBe(noColorStr);
  });
  it("Throws when incorrect colors used", () => {
    let thrownError;
    try {
      new LegendEntry("foo", "bar");
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toBeInstanceOf(IncorrectLegendEntry);
  });
});
