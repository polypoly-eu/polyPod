import {Matcher, Pod, PolyIn, PolyOut, Response, RequestInit, EncodingOptions} from "@polypoly-eu/poly-api";
import {Term, Quad, Quad_Subject, Quad_Predicate, Quad_Object, Quad_Graph} from "rdf-js";
import {DataFactory, Model} from "@polypoly-eu/rdf";
import {convert} from "@polypoly-eu/rdf-spec";
import {Decoder} from "io-ts/lib/Decoder";

export class ValidationError extends Error {
    constructor(
        msg: string,
        readonly details: string
    ) {
        super(msg);
    }
}


interface Decoders {
    expect<T>(input: unknown, msg: string, decoder: Decoder<T>): T;
    encodingOptions: Decoder<EncodingOptions>;
    fetchRequest: Decoder<RequestInit>;
    matcher: Decoder<Partial<Matcher>>;
    quads: Decoder<Quad[]>;
    string: Decoder<string>;
}

async function decoders(): Promise<Decoders> {
    const Decode = await import("io-ts/lib/Decoder");
    const {fold} = await import("fp-ts/lib/Either");
    const {pipe} = await import("fp-ts/lib/pipeable");
    const strictFactory = new DataFactory(true);

    function expect<T>(input: unknown, msg: string, decoder: Decoder<T>): T {
        return pipe(
            decoder.decode(input),
            fold(
                error => {
                    throw new ValidationError(msg, Decode.draw(error));
                },
                t => t
            )
        );
    }

    const fetchRequest = Decode.partial<RequestInit>({
        body: Decode.string,
        credentials: Decode.literal("include", "omit", "same-origin"),
        headers: Decode.union(
            Decode.array(Decode.array(Decode.string)),
            Decode.record(Decode.string)
        ),
        integrity: Decode.string,
        keepalive: Decode.boolean,
        method: Decode.string,
        redirect: Decode.literal("error", "follow", "manual"),
        referrer: Decode.string,
        referrerPolicy: Decode.literal(
            "",
            "no-referrer",
            "no-referrer-when-downgrade",
            "origin",
            "origin-when-cross-origin",
            "same-origin",
            "strict-origin",
            "strict-origin-when-cross-origin",
            "unsafe-url"
        )
    });

    const term: Decoder<Term> = {
        decode: u => {
            try {
                const converted = convert(u as any, strictFactory);
                if (converted instanceof Model)
                    return Decode.success(converted as Term);
                else
                    return Decode.failure(u,"Expected term");
            }
            catch (err) {
                return Decode.failure(u, err.message);
            }
        }
    };

    const subject: Decoder<Quad_Subject> = pipe(
        term,
        Decode.parse(input => {
            if (input.termType === "Literal")
                return Decode.failure(input, "Subject can't be a literal");
            if (input.termType === "DefaultGraph")
                return Decode.failure(input, "Subject can't be the default graph");
            return Decode.success(input);
        })
    );

    const predicate: Decoder<Quad_Predicate> = pipe(
        term,
        Decode.parse(input => {
            if (input.termType !== "Variable" && input.termType !== "NamedNode")
                return Decode.failure(input, "Predicate must be either variable or named node");
            return Decode.success(input);
        })
    );

    const object: Decoder<Quad_Object> = pipe(
        term,
        Decode.parse(input => {
            if (input.termType === "DefaultGraph")
                return Decode.failure(input,"Object can't be the default graph");
            return Decode.success(input);
        })
    );

    const graph: Decoder<Quad_Graph> = pipe(
        term,
        Decode.parse(input => {
            if (input.termType === "Literal")
                return Decode.failure(input, "Graph can't be a literal");
            return Decode.success(input);
        })
    );

    const matcher = Decode.partial<Matcher>({ subject, predicate, object });

    const quad = pipe(
        Decode.type({ subject, predicate, object, graph }),
        Decode.parse(({subject, predicate, object, graph}) =>
            Decode.success(strictFactory.quad(subject, predicate, object, graph))
        )
    );

    const encodingOptions = Decode.type<EncodingOptions>({
        encoding: Decode.literal("ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "base64", "latin1", "binary", "hex")
    });

    return {
        expect,
        encodingOptions,
        fetchRequest,
        matcher,
        quads: Decode.array(quad),
        string: Decode.string
    };
}



export class ValidatingPod implements Pod {

    private readonly _decoders: Promise<Decoders>;
    public readonly dataFactory = new DataFactory(true);

    constructor(
        private readonly pod: Pod
    ) {
        this._decoders = decoders();
    }

    get polyIn(): PolyIn {
        const pod = this;
        const polyIn = this.pod.polyIn;

        return {
            async select(matcher?: unknown): Promise<Quad[]> {
                const decoders = await pod._decoders;

                let validatedMatcher: Partial<Matcher>;

                if (matcher === undefined || matcher === null)
                    validatedMatcher = {};
                else
                    validatedMatcher = decoders.expect(matcher, "Matcher must be wellformed", decoders.matcher);

                return polyIn.select(validatedMatcher);
            },
            async add(...quads: unknown[]): Promise<void> {
                const decoders = await pod._decoders;

                // we assume that non-default graphs are filtered out in the underlying pod
                const validatedQuads = decoders.expect(quads, "Quads must be wellformed", decoders.quads);

                return polyIn.add(...validatedQuads);
            }
        };
    }

    get polyOut(): PolyOut {
        const pod = this;
        const polyOut = this.pod.polyOut;

        return new class implements PolyOut {
            async fetch(input?: unknown, init?: unknown): Promise<Response> {
                const decoders = await pod._decoders;

                const validatedInput = decoders.expect(input, "Input must be a string", decoders.string);

                let validatedInit: RequestInit;

                if (init === undefined || init === null)
                    validatedInit = {};
                else
                    validatedInit = decoders.expect(init, "RequestInit must be wellformed", decoders.fetchRequest);

                return polyOut.fetch(validatedInput, validatedInit);
            }

            async readdir(path?: unknown): Promise<string[]> {
                const decoders = await pod._decoders;

                const validatedPath = decoders.expect(path, "Path must be a string", decoders.string);

                return polyOut.readdir(validatedPath);
            }

            readFile(path: unknown, options?: unknown): Promise<string>;
            readFile(path?: unknown): Promise<Uint8Array>;

            async readFile(path?: unknown, options?: unknown): Promise<string | Uint8Array> {
                const decoders = await pod._decoders;

                const validatedPath = decoders.expect(path, "Path must be a string", decoders.string);

                if (options === undefined)
                    return polyOut.readFile(validatedPath);

                const validatedOptions = decoders.expect(options, "Options must be wellformed", decoders.encodingOptions);

                return polyOut.readFile(validatedPath, validatedOptions);
            }

            async writeFile(path?: unknown, contents?: unknown, options?: unknown): Promise<void> {
                const decoders = await pod._decoders;

                const validatedPath = decoders.expect(path, "Path must be a string", decoders.string);
                const validatedContents = decoders.expect(contents, "Contents must be a string", decoders.string);
                const validatedOptions = decoders.expect(options, "Options must be wellformed", decoders.encodingOptions);

                return polyOut.writeFile(validatedPath, validatedContents, validatedOptions);
            }

            async stat(path?: unknown): Promise<void> {
                const decoders = await pod._decoders;

                const validatedPath = decoders.expect(path, "Path must be a string", decoders.string);

                return polyOut.stat(validatedPath);
            }
        };
    }

}
