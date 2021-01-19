import { Page } from "puppeteer";
import { exposedPromise } from "exposed-promises";
import { Server } from "http";
import { detectFeature } from "./cli/_common";
import { serve } from "./serve";

interface TestResult {
    failures: number;
    message?: string;
}

declare global {
    interface Window {
        testCompleted(result: TestResult): void;
    }
}

export async function testServer(port: number): Promise<Server> {
    const [dir, manifest] = await detectFeature({});
    return serve(port, dir, manifest);
}

export async function preparePage(page: Page): Promise<() => Promise<TestResult>> {
    const { resolve, promise } = exposedPromise<TestResult>();

    await page.exposeFunction("testCompleted", (result: TestResult) => resolve(result));

    return () => promise;
}

export function raiseOnFailure(result: TestResult): void {
    if (result.failures > 0) {
        let msg = `${result.failures} test(s) failed`;
        if (result.message) msg += `; message: ${result.message}`;
        throw new Error(msg);
    }

    if (result.message) console.log(result.message);
}
