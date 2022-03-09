/**
 * Type definitions for a stripped-down version of `window.fetch`. The main definition is [[Fetch]].
 *
 * The definitions are modelled after TypeScript's built-in DOM types. Restrictions have been made to improve
 * portability of the objects; for example, bodies cannot be `Blob`s or `Stream`s.
 *
 * @packageDocumentation
 */

export type HeadersInit = string[][] | Record<string, string>;

export interface RequestInit {
    body?: string;
    credentials?: RequestCredentials;
    headers?: HeadersInit;
    integrity?: string;
    keepalive?: boolean;
    method?: string;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
}

export interface Response {
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;
    json(): Promise<{ [key: string]: string }>;
    text(): Promise<string>;
}

/**
 * A stripped-down version of `window.fetch` that provides most features needed in real-world use cases.
 *
 * The type definition here is a subset of what browsers offer (see
 * [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for details).
 *
 * Possible implementations include:
 * - `window.fetch` (when running in a DOM context)
 * - [node-fetch](https://www.npmjs.com/package/node-fetch) for Node.js
 * - [unfetch](https://www.npmjs.com/package/unfetch) for Node.js
 */
export type Fetch = (input: string, init?: RequestInit) => Promise<Response>;
