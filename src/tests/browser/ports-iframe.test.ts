import {Handler, Port, Portal} from "../../ports";
import {timeout} from "promise-timeout";
import {portSpec} from "../../specs/port";
import {iframeOuterPort} from "../../browser/ports-iframe";

async function makeIframe(root: HTMLElement, src: string): Promise<HTMLIFrameElement> {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", src);
    return new Promise(resolve => {
        iframe.onload = () => resolve(iframe);
        root.appendChild(iframe);
    });
}

function receiveSingleMessage(port: Port): Promise<any> {
    return new Promise(resolve => {
        let done = false;
        const handler: Handler = event => {
            if (done)
                return;

            done = true;
            resolve(event.data);
        };
        port.addHandler(handler);
    });
}

const iframePortal: Portal = async () => {
    const root = document.createElement("div");
    document.body.appendChild(root);

    const iframe = await makeIframe(root, "/base/src/tests/data/iframe.html");

    const port1 = iframeOuterPort("1", iframe);
    const port2 = iframeOuterPort("2", iframe);

    await receiveSingleMessage(iframeOuterPort("control", iframe));

    return {
        port1, port2,
        cleanup: () => document.body.removeChild(root)
    };
};

describe("RPC through iframe", () => {

    it("Simple iframe communication", async () => {
        const { port1, port2, cleanup } = await iframePortal();

        const promise = receiveSingleMessage(port2);
        port1.postMessage("hello");
        await expectAsync(promise).toBeResolved("hello");

        cleanup();
    });

    it("No interference", async () => {
        const iframe1 = await iframePortal();
        const iframe2 = await iframePortal();

        const futilePromise = receiveSingleMessage(iframe2.port2);
        const realPromise = receiveSingleMessage(iframe1.port2);

        iframe1.port1.postMessage("hello");
        await expectAsync(realPromise).toBeResolved("hello");

        const timeoutedPromise = timeout(futilePromise, 1000);

        await expectAsync(timeoutedPromise).toBeRejectedWithError(/Timeout/);

        iframe1.cleanup();
        iframe2.cleanup();
    });

    portSpec("Port spec", iframePortal);

});
