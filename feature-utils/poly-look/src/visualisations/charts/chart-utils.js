export function mapToChartDataArray(map) {
  return Object.entries(map).map(([key, value]) => ({
    title: key,
    value,
  }));
}
