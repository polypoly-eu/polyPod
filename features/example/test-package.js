const { preparePage, raiseOnFailure } = require("@polypoly-eu/orodruin");
const puppeteer = require("puppeteer");
const serveStatic = require("serve-static");
const createServer = require("connect");
const { once } = require("events");

(async () => {
    const app = createServer();
    app.use(serveStatic("./static"));

    const server = app.listen();
    await once(server, "listening");
    const port = server.address().port;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const resultFn = await preparePage(page);

    await page.goto(`http://localhost:${port}`);

    const result = await resultFn();

    server.close();
    browser.close();

    console.dir(result);

    raiseOnFailure(result);
})();
