import { mapToChartDataArray } from "../../src/visualisations/charts/chart-utils";

const testMap = {
  first: 1,
  second: 2,
};

describe("mapToChartData", () => {
  it("transforms as expected", () => {
    const chartDataArray = mapToChartDataArray(testMap);
    expect(chartDataArray).toStrictEqual([
      { title: "first", value: 1 },
      { title: "second", value: 2 },
    ]);
  });
});
