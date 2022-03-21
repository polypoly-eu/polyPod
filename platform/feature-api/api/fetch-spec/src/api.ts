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

