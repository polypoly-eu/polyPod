import fetch from "unfetch";
import { fetchSpec, getHttpbinUrl } from "..";
import { JSDOM } from "jsdom";

const jsdom = new JSDOM();

global.XMLHttpRequest = jsdom.window.XMLHttpRequest;

// <https://github.com/jsdom/jsdom/issues/2375>
process.on("unhandledRejection", (reason, p) => {
    p.catch((err) => {
        if (typeof err === "object" && err.name === "StatusCodeError") {
            // do nothing;
        } else {
            console.dir(err);
            process.exit(1);
        }
    });
});

describe("unfetch", () => {
    fetchSpec(fetch, getHttpbinUrl());
});
