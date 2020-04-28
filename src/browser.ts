import {Consumer, Port} from "./port";

export function fromMessagePort(port: MessagePort): Port<MessageEvent, unknown> {
    return {
        send(value: unknown): void {
            port.postMessage(value);
        },
        addHandler(handler: Consumer<MessageEvent>): void {
            port.addEventListener("message", message => handler(message));
        }
    };
}
