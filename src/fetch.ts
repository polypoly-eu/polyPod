type HeadersInit = string[][] | Record<string, string>;

interface RequestInit {
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

interface Response {
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;
    json(): Promise<any>;
    text(): Promise<string>;
}

export interface Fetch {
    (input: string, init?: RequestInit): Promise<Response>;
}
