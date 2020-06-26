import {AsyncOperation, AsyncRecord, Filter, Interceptor, nullInterceptor, intercept} from "@polypoly-eu/aop-ts";
import {PolyIn, PolyOut, Pod} from "@polypoly-eu/poly-api";
import {DataFactory} from "rdf-js";

export interface Logger {
    called(operation: string, args: any[]): void;
    finished(operation: string, ret?: any): void;
}

export const nullLogger: Logger = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    called: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    finished: () => {}
};

export const defaultLogger: Logger = {
    called: (operation, args) =>
        console.log(`Operation ${operation} called with arguments: ${JSON.stringify(args)}`),
    finished: (operation, ret?) => {
        console.log(`Operation ${operation} finished.`);
        if (ret) {
            console.log(`Return value:`);
            console.dir(ret);
        }
    }
};

export function interceptorOfLogger<This extends AsyncRecord<This>>(logger: Logger): Interceptor<This> {
    return {
        async guard<Name extends keyof This>(operation: AsyncOperation<This, Name>): Promise<Filter<This, Name>> {
            logger.called(String(operation.name), operation.args);
            return (async res => {
                logger.finished(String(operation.name), res);
                return res;
            }) as Filter<This, Name>;
        }
    };
}

export class TracingPod implements Pod {

    public readonly dataFactory: DataFactory;
    public readonly polyIn: PolyIn;
    public readonly polyOut: PolyOut;

    constructor(
        pod: Pod,
        interceptPolyIn: Interceptor<PolyIn> = nullInterceptor,
        interceptPolyOut: Interceptor<PolyOut> = nullInterceptor
    ) {
        this.dataFactory = pod.dataFactory;
        this.polyIn = intercept(pod.polyIn, interceptPolyIn);
        this.polyOut = intercept(pod.polyOut, interceptPolyOut);
    }

}
