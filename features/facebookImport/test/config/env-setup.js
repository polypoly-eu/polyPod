if (typeof global.performance === "undefined") {
    const { performance } = require("perf_hooks");
    Object.defineProperty(global, "performance", {
        value: performance,
    });
}
