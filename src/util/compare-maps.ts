export function compareMaps(map1, map2): boolean {
    let testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (const [key, val] of map1) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (testVal !== val || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}
