import {
    Pod,
    PolyOut,
    PolyLifecycle,
    PolyIn,
    PolyNav,
    ExternalFile,
    Endpoint,
    EncodingOptions,
    Entry,
    Matcher,
    Stats,
    Info,
    SPARQLQueryResult,
} from "@polypoly-eu/api";
import { DataFactory, Quad } from "rdf-js";

class AsyncPolyOut implements PolyOut {
    constructor(private readonly promise: Promise<PolyOut>) {}

    readFile(path: string, options: EncodingOptions): Promise<string>;
    readFile(path: string): Promise<Uint8Array>;
    async readFile(
        path: string,
        options?: EncodingOptions
    ): Promise<string | Uint8Array> {
        if (options) return (await this.promise).readFile(path, options);
        else return (await this.promise).readFile(path);
    }

    async writeFile(
        path: string,
        content: string,
        options: EncodingOptions
    ): Promise<void> {
        return (await this.promise).writeFile(path, content, options);
    }
    async stat(path: string): Promise<Stats> {
        return (await this.promise).stat(path);
    }
    async readDir(path: string): Promise<Entry[]> {
        return (await this.promise).readDir(path);
    }

    async importArchive(url: string, destUrl?: string): Promise<string> {
        return (await this.promise).importArchive(url, destUrl);
    }

    async removeArchive(fileId: string): Promise<void> {
        return (await this.promise).removeArchive(fileId);
    }
}

class AsyncPolyIn implements PolyIn {
    constructor(private readonly promise: Promise<PolyIn>) {}

    async match(matcher: Partial<Matcher>): Promise<Quad[]> {
        return (await this.promise).match(matcher);
    }

    async add(quad: Quad): Promise<void> {
        return (await this.promise).add(quad);
    }

    async delete(quad: Quad): Promise<void> {
        return (await this.promise).delete(quad);
    }

    async has(quad: Quad): Promise<boolean> {
        return (await this.promise).has(quad);
    }

    async query(query: string): Promise<SPARQLQueryResult> {
        return (await this.promise).query(query);
    }

    async update(query: string): Promise<void> {
        return (await this.promise).update(query);
    }
}

class AsyncPolyNav implements PolyNav {
    constructor(private readonly promise: Promise<PolyNav>) {}

    async openUrl(url: string): Promise<void> {
        return (await this.promise).openUrl(url);
    }

    async setActiveActions(actions: string[]): Promise<void> {
        return (await this.promise).setActiveActions(actions);
    }

    async setTitle(title: string): Promise<void> {
        return (await this.promise).setTitle(title);
    }

    async pickFile(type?: string): Promise<ExternalFile | null> {
        return (await this.promise).pickFile(type);
    }
}

class AsyncInfo implements Info {
    constructor(private readonly promise: Promise<Info>) {}

    async getRuntime(): Promise<string> {
        return (await this.promise).getRuntime();
    }

    async getVersion(): Promise<string> {
        return (await this.promise).getVersion();
    }
}

class AsyncEndpoint implements Endpoint {
    constructor(private readonly promise: Promise<Endpoint>) {}

    async send(
        endpointId: string,
        payload: string,
        contentType?: string,
        authToken?: string
    ): Promise<void> {
        return (await this.promise).send(
            endpointId,
            payload,
            contentType,
            authToken
        );
    }

    async get(
        endpointId: string,
        contentType?: string,
        authToken?: string
    ): Promise<string> {
        return (await this.promise).get(endpointId, contentType, authToken);
    }
}

class AsyncPolyLifecycle implements PolyLifecycle {
    constructor(private readonly promise: Promise<PolyLifecycle | undefined>) {}

    private async force(): Promise<PolyLifecycle> {
        const lifecycle = await this.promise;
        if (lifecycle) return lifecycle;
        throw new Error("Lifecycle is not implemented");
    }

    async listFeatures(): Promise<Record<string, boolean>> {
        return (await this.force()).listFeatures();
    }

    async startFeature(id: string, background: boolean): Promise<void> {
        return (await this.force()).startFeature(id, background);
    }
}

export class AsyncPod implements Pod {
    readonly polyOut: PolyOut;
    readonly polyIn: PolyIn;
    readonly polyNav: PolyNav;
    readonly info: Info;
    readonly endpoint: Endpoint;
    readonly polyLifecycle: PolyLifecycle;

    constructor(
        private readonly promise: Promise<Pod>,
        public readonly dataFactory: DataFactory
    ) {
        this.polyOut = new AsyncPolyOut(promise.then((pod) => pod.polyOut));
        this.polyIn = new AsyncPolyIn(promise.then((pod) => pod.polyIn));
        this.polyNav = new AsyncPolyNav(promise.then((pod) => pod.polyNav));
        this.info = new AsyncInfo(promise.then((pod) => pod.info));
        this.endpoint = new AsyncEndpoint(promise.then((pod) => pod.endpoint));
        this.polyLifecycle = new AsyncPolyLifecycle(
            promise.then((pod) => pod.polyLifecycle)
        );
    }
}
