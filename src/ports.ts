import {Typeson} from "@polypoly-eu/bubblewrap";

export interface MessageEvent {
    data: any;
    ports: ReadonlyArray<MessagePort>;
    source: MessageEventSource | null;
}

export type Handler = (event: MessageEvent) => void;

export interface Port {
    postMessage(value: any): void;
    addHandler(handler: Handler): void;
}

export function typesonPort(port: Port, typeson: Typeson): Port {
    return {
        postMessage(value: any): void {
            port.postMessage(typeson.encapsulate(value));
        },
        addHandler(handler: Handler): void {
            port.addHandler(event => {
                handler({ ...event, data: typeson.revive(event.data) });
            });
        }
    };
}

export function forward(from: Port, to: Port): void {
    from.addHandler(event => to.postMessage(event.data));
}

export function connect(port1: Port, port2: Port): void {
    forward(port1, port2);
    forward(port2, port1);
}

export type Portal = () => Promise<{
    port1: Port;
    port2: Port;
    cleanup(): void;
}>

export type ReqRes<Req, Res> = (req: Req) => Promise<Res>;

interface PromiseCompleters<T> {
    resolve: (t: T) => void;
    reject: (reason?: any) => void;
}

export function makeClient<Req, Res>(port: Port): ReqRes<Req, Res> {
    let id = 0;
    const pending = new Map<number, PromiseCompleters<Res>>();
    port.addHandler(event => {
        const data = event.data;
        if (data.id === undefined || !pending.has(data.id))
            return;

        const { resolve, reject } = pending.get(data.id)!;

        if (data.error)
            reject(data.error);
        else
            resolve(data.response);
    });
    return req => new Promise<Res>((resolve, reject) => {
        const currentId = ++id;
        pending.set(currentId, { resolve, reject });
        const request = {
            request: req,
            id: currentId,
        };
        port.postMessage(request);
    });
}

export function makeServer<Req, Res>(port: Port, handler: ReqRes<Req, Res>): void {
    port.addHandler(event => {
        const data = event.data;
        if (data.id === undefined)
            return;
        (async () => {
            try {
                const res: Res = await handler(data.request);
                port.postMessage({
                    id: data.id,
                    response: res
                });
            }
            catch (ex) {
                port.postMessage({
                    id: data.id,
                    error: ex
                });
            }
        })();
    });
}
