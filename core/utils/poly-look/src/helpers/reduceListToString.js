export function reduceListToString(acc, value, index, list) {
  return index === list.length - 1
    ? `${acc} and ${value}`
    : index === 0
    ? value
    : `${acc}, ${value}`;
}
