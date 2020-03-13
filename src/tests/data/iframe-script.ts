import {connect} from "../../ports";
import {iframeInnerPort} from "../../browser/ports-iframe";

async function init(): Promise<void> {
    const port1 = await iframeInnerPort("1");
    const port2 = await iframeInnerPort("2");
    connect(port1, port2);
    const control = await iframeInnerPort("control");
    control.postMessage({});
}

init();
