/**
 * Converts the properties in the supplied object to input suitable
 * for {@link PolyChart}.
 *
 * @param map {Object} - The properties to map.
 * @returns {Object[]} - Chart data.
 */
export function mapToChartDataArray(map) {
  return Object.entries(map).map(([key, value]) => ({
    title: key,
    value,
  }));
}
