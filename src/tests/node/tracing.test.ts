import { DefaultPod, PolyIn, PolyOut } from "@polypoly-eu/poly-api";
import { Volume } from "memfs";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { podSpec } from "@polypoly-eu/poly-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/fetch-spec";
import { interceptorOfLogger, Logger, nullLogger, TracingPod } from "../../tracing";
import { Interceptor } from "@polypoly-eu/aop-ts";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Tracing pod", () => {
    const fs = new Volume().promises as any;
    const underlying = new DefaultPod(dataset(), fs, fetch);

    describe("No interceptor", () => {
        podSpec(new TracingPod(underlying), "/", getHttpbinUrl());
    });

    describe("No logger", () => {
        podSpec(
            new TracingPod(
                underlying,
                interceptorOfLogger(nullLogger),
                interceptorOfLogger(nullLogger)
            ),
            "/",
            getHttpbinUrl()
        );
    });

    describe("Logger", () => {
        it("Records calls", async () => {
            const callLog: any[] = [];
            const finishLog: any[] = [];

            const logger: Logger = {
                called: (...args) => {
                    callLog.push(args);
                },
                finished: (...args) => {
                    finishLog.push(args);
                },
            };

            const pod = new TracingPod(
                new DefaultPod(dataset(), fs, fetch),
                interceptorOfLogger(logger),
                interceptorOfLogger(logger)
            );

            await pod.polyIn.select({});

            assert.deepEqual(callLog, [["select", [{}]]]);
            assert.deepEqual(finishLog, [["select", []]]);
        });
    });

    it("polyOut-then-polyIn", async () => {
        let hasAccessedPolyIn = false;

        const polyInInterceptor: Interceptor<PolyIn> = {
            async guard(): Promise<undefined> {
                hasAccessedPolyIn = true;
                return;
            },
        };

        const polyOutInterceptor: Interceptor<PolyOut> = {
            async guard(): Promise<undefined> {
                if (hasAccessedPolyIn) throw new Error("rejected");

                return;
            },
        };

        const pod = new TracingPod(
            new DefaultPod(dataset(), fs, fetch),
            polyInInterceptor,
            polyOutInterceptor
        );

        await assert.eventually.isObject(pod.polyOut.stat("/"));
        await assert.eventually.deepEqual(pod.polyIn.select({}), []);
        await assert.isRejected(pod.polyOut.fetch("http://evil.com"), /rejected/);
    });
});
