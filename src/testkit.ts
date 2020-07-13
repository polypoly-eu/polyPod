import {Page} from "puppeteer";
import {exposedPromise} from "exposed-promises";
import {Server} from "http";
import {detectFeature} from "./cli/_common";
import {Volume} from "memfs";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {serve} from "./serve";
import {Pod, DefaultPod} from "@polypoly-eu/poly-api";

interface TestResult {
    failures: number;
    message?: string;
}

declare global {
    interface Window {
        testCompleted(result: TestResult): void;
    }
}

export function inMemoryPod(): Pod {
    return new DefaultPod(
        dataset(),
        new Volume().promises as any,
        fetch
    );
}

export async function testServer(port: number, pod: Pod = inMemoryPod()): Promise<Server> {
    const [dir, manifest] = await detectFeature({});
    return serve(port, pod, dir, manifest);
}

export async function preparePage(page: Page): Promise<() => Promise<TestResult>> {
    const {resolve, promise} = exposedPromise<TestResult>();

    await page.exposeFunction("testCompleted", (result: TestResult) => resolve(result));

    return () => promise;
}

export function raiseOnFailure(result: TestResult): void {
    if (result.failures > 0) {
        let msg = `${result.failures} test(s) failed`;
        if (result.message)
            msg += `; message: ${result.message}`;
        throw new Error(msg);
    }

    if (result.message)
        console.log(result.message);
}
