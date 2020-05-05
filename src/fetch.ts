import {RequestPort} from "./procedure";
import {mapSendPort} from "./port";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";
import {Try} from "./util";

export function fetchPort<T>(
    url: string,
    contentType: string,
    parse: (body: Body) => Promise<T>,
    fetch: typeof window.fetch
): RequestPort<BodyInit, T> {
    return {
        send: async request => {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": contentType
                },
                method: "post",
                body: request.request
            });

            try {
                const parsed = await parse(response);
                request.responder.resolve(parsed);
            }
            catch (err) {
                request.responder.reject(err);
            }
        }
    };
}

export function jsonFetchPort(
    url: string,
    fetch: typeof window.fetch
): RequestPort<any, any> {
    const rawPort = fetchPort<any>(
        url,
        "application/json",
        async body => {
            const raw = await body.json();
            if (raw.error)
                throw raw.error;
            else
                return raw.response;
        },
        fetch
    );

    return mapSendPort(
        rawPort,
        data => ({
            responder: data.responder,
            request: JSON.stringify(data.request)
        })
    );
}

export function bubblewrapFetchPort(
    url: string,
    bubblewrap: Bubblewrap,
    fetch: typeof window.fetch
): RequestPort<any, any> {
    const rawPort = fetchPort<any>(
        url,
        "application/octet-stream",
        async body => {
            const decoded: Try<any> = bubblewrap.decode(new Uint8Array(await body.arrayBuffer()));
            if (decoded.tag === "failure")
                throw decoded.err;
            else
                return decoded.value;
        },
        fetch
    );

    return mapSendPort(
        rawPort,
        data => ({
            responder: data.responder,
            request: bubblewrap.encode(data.request)
        })
    );
}