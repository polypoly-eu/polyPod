import { portSpec } from "../../specs/port";
import { iframeOuterPort } from "../../browser";
import { Port, receiveSingle } from "../../port";
import { flipLifecycle } from "../_lifecycles";
import { assert } from "chai";
import { timeout, TimeoutError } from "promise-timeout";
import { Resource } from "../../util";

async function makeIframe(root: HTMLElement, src: string): Promise<HTMLIFrameElement> {
    const iframe = document.createElement("iframe");
    return new Promise((resolve) => {
        iframe.onload = () => resolve(iframe);
        iframe.setAttribute("src", src);
        root.appendChild(iframe);
    });
}

const iframeLifecycle: () => Promise<Resource<[Port<any, any>, Port<any, any>]>> = async () => {
    const root = document.createElement("div");
    document.body.appendChild(root);

    const iframe = await makeIframe(root, "/base/src/tests/data/iframe.html");

    const port1 = iframeOuterPort("1", iframe);
    const port2 = iframeOuterPort("2", iframe);

    await receiveSingle(iframeOuterPort("control", iframe));

    return {
        value: [port1, port2],
        cleanup: async () => {
            document.body.removeChild(root);
        },
    };
};

describe("Browser", function () {
    this.timeout(10000);

    describe("iframe basics", () => {
        it("simple communication", async () => {
            const resource = await iframeLifecycle();
            const [port1, port2] = resource.value;

            const promise1 = receiveSingle(port1);
            const promise2 = receiveSingle(port2);

            port1.send("hello");
            port2.send("world");

            await assert.eventually.equal(promise2, "hello");
            await assert.eventually.equal(promise1, "world");
        });

        it("no interference", async () => {
            const iframe1 = await iframeLifecycle();
            const iframe2 = await iframeLifecycle();

            const futilePromise = receiveSingle(iframe2.value[1]);
            const realPromise = receiveSingle(iframe1.value[1]);

            iframe1.value[0].send("hello");
            await assert.eventually.equal(realPromise, "hello");

            const timeoutedPromise = timeout(futilePromise, 1000);

            await assert.isRejected(timeoutedPromise, TimeoutError);
        });
    });

    describe("iframe", () => {
        portSpec(iframeLifecycle);

        describe("Flipped", () => {
            portSpec(flipLifecycle(iframeLifecycle));
        });
    });
});
