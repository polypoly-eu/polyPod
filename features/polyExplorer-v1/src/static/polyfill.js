// We need to polyfill Object.fromEntries in order to support Android API level
// 24. Ideally this should not be something feature authors need to worry about,
// but as long as the polyPod uses a system WebView and supports old Android
// versions, we could at most make it more convenient.
if (!Object.fromEntries) {
    Object.fromEntries = function (entries) {
        const obj = {};
        entries.forEach(([key, value]) => (obj[key] = value));
        return obj;
    };
}
