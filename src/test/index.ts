import {preparePage, raiseOnFailure} from "../testkit";

export async function test(
    url: string
): Promise<void> {
    const {default: puppeteer} = await import("puppeteer");

    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();
        const resultSupplier = await preparePage(page);
        await page.goto(url);
        const results = await resultSupplier();
        console.log(`Results: ${JSON.stringify(results)}`);
        raiseOnFailure(results);
    }
    finally {
        await browser.close();
    }
}
