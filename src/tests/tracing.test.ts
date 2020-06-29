import {DefaultPod, PolyIn, PolyOut} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";
import {getHttpbinUrl, podSpec} from "@polypoly-eu/poly-api/dist/spec";
import {interceptorOfLogger, Logger, nullLogger, TracingPod} from "../tracing";
import {Interceptor} from "@polypoly-eu/aop-ts";

describe("Tracing pod", () => {

    const fs = new Volume().promises as any;
    const underlying = new DefaultPod(dataset(), fs, fetch);

    describe("No interceptor", () => {
        podSpec(new TracingPod(underlying), "/", getHttpbinUrl());
    });

    describe("No logger", () => {
        podSpec(new TracingPod(
            underlying,
            interceptorOfLogger(nullLogger),
            interceptorOfLogger(nullLogger)
        ), "/", getHttpbinUrl());
    });

    describe("Logger", () => {

        it("Records calls", async () => {
            const called = jest.fn();
            const finished = jest.fn();

            const logger: Logger = {
                called,
                finished
            };

            const pod = new TracingPod(
                new DefaultPod(dataset(), fs, fetch),
                interceptorOfLogger(logger),
                interceptorOfLogger(logger)
            );

            await pod.polyIn.select({});

            expect(called).toHaveBeenCalledTimes(1);
            expect(called).toHaveBeenCalledWith("select", [{}]);

            expect(finished).toHaveBeenCalledTimes(1);
            expect(finished).toHaveBeenCalledWith("select", []);
        });

    });

    it("polyOut-then-polyIn", async () => {
        let hasAccessedPolyIn = false;

        const polyInInterceptor: Interceptor<PolyIn> = {
            async guard(): Promise<undefined> {
                hasAccessedPolyIn = true;
                return;
            }
        };

        const polyOutInterceptor: Interceptor<PolyOut> = {
            async guard(): Promise<undefined> {
                if (hasAccessedPolyIn)
                    throw new Error("rejected");

                return;
            }
        };

        const pod = new TracingPod(
            new DefaultPod(dataset(), fs, fetch),
            polyInInterceptor,
            polyOutInterceptor
        );

        await expect(pod.polyOut.stat("/")).resolves.toEqual(undefined);
        await expect(pod.polyIn.select({})).resolves.toEqual([]);
        await expect(pod.polyOut.fetch("http://evil.com")).rejects.toThrowError("rejected");
    });

});
