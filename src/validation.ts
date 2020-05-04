import {Matcher, Pod, PolyIn, PolyOut, Response, RequestInit, EncodingOptions} from "@polypoly-eu/poly-api";
import {Term, Quad, Quad_Subject, Quad_Predicate, Quad_Object, Quad_Graph} from "rdf-js";
import {DataFactory, Model} from "@polypoly-eu/rdf";
import {convert} from "@polypoly-eu/rdf-spec";
import {Tree} from "fp-ts/lib/Tree";
import {fold, left, right} from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";
import * as Decode from "io-ts/lib/Decoder";

export class ValidationError extends Error {
    constructor(
        msg: string,
        readonly details: Tree<string>[]
    ) {
        super(msg);
    }
}

function expect<T>(input: unknown, msg: string, decoder: Decode.Decoder<T>): T {
    return pipe(
        decoder.decode(input),
        fold(
            errors => {
                throw new ValidationError(msg, errors);
            },
            t => t
        )
    );
}

const fetchRequestInitDecoder = Decode.partial<RequestInit>({
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

const strictFactory = new DataFactory(true);

const termDecoder: Decode.Decoder<Term> = {
    decode: u => {
        try {
            const converted = convert(u as any, strictFactory);
            if (converted instanceof Model)
                return right(converted as Term);
            else
                return left("Expected term");
        }
        catch (err) {
            return left(err.message);
        }
    }
};

const subjectDecoder: Decode.Decoder<Quad_Subject> = Decode.parse(
    termDecoder,
    input => {
        if (input.termType === "Literal")
            return left("Subject can't be a literal");
        if (input.termType === "DefaultGraph")
            return left("Subject can't be the default graph");
        return right(input);
    }
);

const predicateDecoder: Decode.Decoder<Quad_Predicate> = Decode.parse(
    termDecoder,
    input => {
        if (input.termType !== "Variable" && input.termType !== "NamedNode")
            return left("Predicate must be either variable or named node");
        return right(input);
    }
);

const objectDecoder: Decode.Decoder<Quad_Object> = Decode.parse(
    termDecoder,
    input => {
        if (input.termType === "DefaultGraph")
            return left("Object can't be the default graph");
        return right(input);
    }
);

const graphDecoder: Decode.Decoder<Quad_Graph> = Decode.parse(
    termDecoder,
    input => {
        if (input.termType === "Literal")
            return left("Graph can't be a literal");
        return right(input);
    }
);

const matcherDecoder = Decode.partial<Matcher>({
    subject: subjectDecoder,
    predicate: predicateDecoder,
    object: objectDecoder
});

const quadDecoder = Decode.parse(
    Decode.type({
        subject: subjectDecoder,
        predicate: predicateDecoder,
        object: objectDecoder,
        graph: graphDecoder
    }),
    ({subject, predicate, object, graph}) =>
        right(strictFactory.quad(subject, predicate, object, graph))
);

const encodingOptionsDecoder = Decode.type<EncodingOptions>({
    encoding: Decode.literal("ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "base64", "latin1", "binary", "hex")
});

export class ValidatingPod implements Pod {

    constructor(
        private readonly pod: Pod
    ) {}

    get polyIn(): PolyIn {
        const polyIn = this.pod.polyIn;

        return {
            factory: strictFactory,
            async select(matcher?: unknown): Promise<Quad[]> {
                let validatedMatcher: Partial<Matcher>;

                if (matcher === undefined || matcher === null)
                    validatedMatcher = {};
                else
                    validatedMatcher = expect(matcher, "Matcher must be wellformed", matcherDecoder);

                return polyIn.select(validatedMatcher);
            },
            async add(...quads: unknown[]): Promise<void> {
                // we assume that non-default graphs are filtered out in the underlying pod
                const validatedQuads = expect(quads, "Quads must be wellformed", Decode.array(quadDecoder));

                return polyIn.add(...validatedQuads);
            }
        };
    }

    get polyOut(): PolyOut {
        const polyOut = this.pod.polyOut;

        return {
            async fetch(input?: unknown, init?: unknown): Promise<Response> {
                const validatedInput = expect(input, "Input must be a string", Decode.string);

                let validatedInit: RequestInit;

                if (init === undefined || init === null)
                    validatedInit = {};
                else
                    validatedInit = expect(init, "RequestInit must be wellformed", fetchRequestInitDecoder);

                return polyOut.fetch(validatedInput, validatedInit);
            },
            async readFile(path?: unknown, options?: unknown): Promise<string> {
                const validatedPath = expect(path, "Path must be a string", Decode.string);
                const validatedOptions = expect(options, "Options must be wellformed", encodingOptionsDecoder);

                return polyOut.readFile(validatedPath, validatedOptions);
            },
            async writeFile(path?: unknown, contents?: unknown, options?: unknown): Promise<void> {
                const validatedPath = expect(path, "Path must be a string", Decode.string);
                const validatedContents = expect(contents, "Contents must be a string", Decode.string);
                const validatedOptions = expect(options, "Options must be wellformed", encodingOptionsDecoder);

                return polyOut.writeFile(validatedPath, validatedContents, validatedOptions);
            },
            async stat(path?: unknown): Promise<void> {
                const validatedPath = expect(path, "Path must be a string", Decode.string);

                return polyOut.stat(validatedPath);
            }
        };
    }

}
