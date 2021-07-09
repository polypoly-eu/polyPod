export function listToStringReducer(acc, element, index, list) {
  return index === 0
    ? element
    : index === list.length - 1
    ? `${acc} and ${element}`
    : `${acc}, ${element}`;
}
