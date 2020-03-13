import {Handler, Port} from "./ports";

export type Fetch = typeof window.fetch;

export function fromFetch(url: string, fetch: Fetch): Port {
    const handlers: Handler[] = [];
    return {
        postMessage(value: any): void {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(value)
            }).then(async response => {
                if (!response.ok)
                    return;
                const json = await response.json();
                for (const handler of handlers)
                    handler({
                        data: json,
                        source: null,
                        ports: []
                    });
            })
        },
        addHandler(handler: Handler): void {
            handlers.push(handler);
        }
    };
}