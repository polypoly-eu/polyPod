// TODO this should be a library

interface RawPromise<T> {
    promise: Promise<T>;
    resolve: (t: T) => void;
    reject: (err?: any) => void;
}

export function rawPromise<T>(): RawPromise<T> {
    let _resolve: (t: T) => void | undefined;
    let _reject: (err?: any) => void | undefined;
    const promise = new Promise<T>((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });
    return { promise, resolve: _resolve!, reject: _reject! };
}

export function fetchWithBaseURI(baseURI: string, fetch: typeof window.fetch): typeof window.fetch {
    return (input, init?) => {
        if (typeof input == "string")
            return fetch(baseURI + input, init);
        else
            return fetch ({ ...input, url: baseURI + input.url }, init);
    };
}
