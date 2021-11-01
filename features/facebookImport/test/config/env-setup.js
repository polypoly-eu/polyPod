import crypto from "crypto";

Object.defineProperty(global, "crypto", {
    value: {
        subtle: crypto.webcrypto.subtle,
    },
});

if (typeof global.TextEncoder === "undefined") {
    const { TextEncoder } = require("util");
    Object.defineProperty(global, "TextEncoder", {
        value: TextEncoder,
    });
}

if (typeof global.TextDecoder === "undefined") {
    const { TextDecoder } = require("util");
    Object.defineProperty(global, "TextDecoder", {
        value: TextDecoder,
    });
}
