import {SendAndReplyPort} from "./procedure";
import {mapSendPort} from "./port";

export function fetchPort<T>(
    url: string,
    contentType: string,
    parse: (body: Body) => Promise<T>,
    fetch: typeof window.fetch
): SendAndReplyPort<BodyInit, T> {
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
): SendAndReplyPort<any, any> {
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