import fetch from "unfetch";
import { fetchSpec, getHttpbinUrl } from "..";
import { JSDOM } from "jsdom";

const jsdom = new JSDOM();

global.XMLHttpRequest = jsdom.window.XMLHttpRequest;

describe("unfetch", () => {
    fetchSpec(fetch, getHttpbinUrl());
});
