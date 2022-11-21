import {
    Pod,
    PolyOut,
    PolyIn,
    PolyNav,
    ExternalFile,
    Endpoint,
    Entry,
    Matcher,
    Stats,
    Info,
    SPARQLQueryResult,
    Triplestore,
} from "@polypoly-eu/api";
import { DataFactory, Quad } from "rdf-js";

/**
 * @classdesc AsyncPolyOut class @implements [[PolyOut]]
 * @class
 */
class AsyncPolyOut implements PolyOut {
    /**
     * It creates a new instance of the AsyncPolyOut class.
     * @param {Promise<PolyOut>} promise - polyOut promise passed
     */
    constructor(private readonly promise: Promise<PolyOut>) {}

    /** @inheritdoc */
    async readFile(path: string): Promise<Uint8Array> {
        return (await this.promise).readFile(path);
    }

    /** @inheritdoc */
    async writeFile(path: string, content: string): Promise<void> {
        return (await this.promise).writeFile(path, content);
    }

    /** @inheritdoc */
    async stat(path: string): Promise<Stats> {
        return (await this.promise).stat(path);
    }

    /** @inheritdoc */
    async readDir(path: string): Promise<Entry[]> {
        return (await this.promise).readDir(path);
    }

    /** @inheritdoc */
    async importArchive(url: string, destUrl?: string): Promise<string> {
        return (await this.promise).importArchive(url, destUrl);
    }

    /** @inheritdoc */
    async removeArchive(fileId: string): Promise<void> {
        return (await this.promise).removeArchive(fileId);
    }
}

/**
 * AsyncTriplestore class @implements [[Triplestore]]
 */
class AsyncTriplestore implements Triplestore {
    /**
     * It creates a new instance of the AsyncTriplestore class.
     * @param {Promise<Triplestore>} promise - promise of Triplestore
     */
    constructor(private readonly promise: Promise<Triplestore>) {}

    /** @inheritdoc */
    async query(query: string): Promise<SPARQLQueryResult> {
        return (await this.promise).query(query);
    }

    /** @inheritdoc */
    async update(query: string): Promise<void> {
        return (await this.promise).update(query);
    }
}

/**
 * AsyncPolyIn class @implements [[PolyIn]]
 * It wraps a promise that resolves to a PolyIn,
 * and implements the PolyIn interface by awaiting the
 * promise and forwarding the method calls to the resolved PolyIn
 */
class AsyncPolyIn implements PolyIn {
    /**
     * It creates a new class AsyncPolyIn instance.
     * @param {Promise<PolyIn>} promise - promise of PolyIn
     */
    constructor(private readonly promise: Promise<PolyIn>) {}

    /** @inheritdoc */
    async match(matcher: Partial<Matcher>): Promise<Quad[]> {
        return (await this.promise).match(matcher);
    }

    /** @inheritdoc */
    async add(quad: Quad): Promise<void> {
        return (await this.promise).add(quad);
    }

    /** @inheritdoc */
    async delete(quad: Quad): Promise<void> {
        return (await this.promise).delete(quad);
    }

    /** @inheritdoc */
    async has(quad: Quad): Promise<boolean> {
        return (await this.promise).has(quad);
    }
}

/**
 * AsyncPolyNav class  @implements [[PolyNav]]
 */
class AsyncPolyNav implements PolyNav {
    /**
     * It creates a new instance of the class AsyncPolyNav.
     * @param promise - promise of PolyNav
     */
    constructor(private readonly promise: Promise<PolyNav>) {}

    /** @inheritdoc */
    async openUrl(url: string): Promise<void> {
        return (await this.promise).openUrl(url);
    }

    /** @inheritdoc */
    async setActiveActions(actions: string[]): Promise<void> {
        return (await this.promise).setActiveActions(actions);
    }

    /** @inheritdoc */
    async setTitle(title: string): Promise<void> {
        return (await this.promise).setTitle(title);
    }

    /** @inheritdoc */
    async pickFile(type?: string): Promise<ExternalFile | null> {
        return (await this.promise).pickFile(type);
    }
}

/**
 * AsyncInfo class that @implements the [[Info]] interface.
 */
class AsyncInfo implements Info {
    /**
     * It creates a new instance of the class AsyncInfo.
     * @param {Promise<Info>} promise - promise of Info
     */
    constructor(private readonly promise: Promise<Info>) {}

    /** @inheritdoc */
    async getRuntime(): Promise<string> {
        return (await this.promise).getRuntime();
    }

    /** @inheritdoc */
    async getVersion(): Promise<string> {
        return (await this.promise).getVersion();
    }
}

/**
 * AsyncEndpoint class that @implements [[Endpoint]]
 */
class AsyncEndpoint implements Endpoint {
    /**
     * It creates a new instance of the class AsyncEndpoint.
     * @param {Promise<Endpoint>} promise - promise of Endpoint
     */
    constructor(private readonly promise: Promise<Endpoint>) {}

    /** @inheritdoc */
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

    /** @inheritdoc */
    async get(
        endpointId: string,
        contentType?: string,
        authToken?: string
    ): Promise<string> {
        return (await this.promise).get(endpointId, contentType, authToken);
    }
}

/**
 * @class AsyncPod
 * @classdesc Async implementation of `Pod`
 * @implements a [[Pod]].
 */
export class AsyncPod implements Pod {
    readonly polyOut: PolyOut;
    readonly polyIn: PolyIn;
    readonly polyNav: PolyNav;
    readonly info: Info;
    readonly endpoint: Endpoint;
    readonly triplestore: Triplestore;

    /**
     * It creates a new `AsyncPod` object.
     * @param {Promise<Pod>} promise - The promise of the pod
     * @param {DataFactory} dataFactory - DataFactory
     */
    constructor(
        private readonly promise: Promise<Pod>,
        public readonly dataFactory: DataFactory
    ) {
        this.polyOut = new AsyncPolyOut(promise.then((pod) => pod.polyOut));
        this.polyIn = new AsyncPolyIn(promise.then((pod) => pod.polyIn));
        this.polyNav = new AsyncPolyNav(promise.then((pod) => pod.polyNav));
        this.info = new AsyncInfo(promise.then((pod) => pod.info));
        this.endpoint = new AsyncEndpoint(promise.then((pod) => pod.endpoint));
        this.triplestore = new AsyncTriplestore(
            this.promise.then((pod) => pod.triplestore)
        );
    }
}
