import {Handler, Port, Portal} from "../ports";

export function fromMessagePort(port: MessagePort): Port {
    return {
        postMessage(value: any): void {
            port.postMessage(value);
        },
        addHandler(handler: Handler): void {
            port.addEventListener("message", handler);
        }
    };
}

export const messageChannelPortal: Portal = () => {
    const {port1, port2} = new MessageChannel();
    port1.start();
    port2.start();
    return Promise.resolve({
        port1: fromMessagePort(port1),
        port2: fromMessagePort(port2),
        cleanup() {
            port1.close();
            port2.close();
        }
    });
};
