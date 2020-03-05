import {createEndpoint, RemoteCallable} from "@shopify/rpc";

export interface Windows {
    readonly server: Window;
    readonly client: Window;
}

export interface Server {
    terminate(): void;
}

export interface Client<T> {
    readonly call: RemoteCallable<T>;
}

type Listener = (event: MessageEvent) => void;

export function makeServer<T>(t: T, windows: Windows): Server {
    const endpoint = createEndpoint<T>({
        addEventListener(event: "message", listener: Listener): void {
            windows.server.addEventListener("message", listener);
        },
        removeEventListener(event: "message", listener: Listener): void {
            windows.server.removeEventListener("message", listener);
        },
        postMessage(message: any, transferables?: Transferable[]): void {
            windows.client.postMessage(message, "*", transferables);
        },
    });

    // @ts-ignore
    endpoint.expose(t);

    return {
        terminate: endpoint.terminate
    };
}

export function makeClient<T>(windows: Windows): Client<T> {
    const endpoint = createEndpoint<T>({
        addEventListener(event: "message", listener: Listener): void {
            windows.client.addEventListener("message", listener);
        },
        removeEventListener(event: "message", listener: Listener): void {
            windows.client.removeEventListener("message", listener);
        },
        postMessage(message: any, transferables?: Transferable[]): void {
            windows.server.postMessage(message, "*", transferables);
        },
    });

    return {
        call: endpoint.call
    };
}
