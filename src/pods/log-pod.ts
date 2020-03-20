import {Pod} from "@polypoly-eu/poly-api";
import {PolyIn, PolyOut} from "@polypoly-eu/poly-api";

export interface Logger {
    called(operation: string, args: Record<string, any>): void;
    finished(operation: string, ret?: any): void;
}

export const nullLogger: Logger = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    called: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    finished: () => {}
};

export class LogPod implements Pod {

    constructor(
        private readonly pod: Pod,
        private readonly logger: Logger
    ) {}

    get polyIn(): PolyIn {
        return {
            factory: this.pod.polyIn.factory,
            select: async matcher => {
                this.logger.called("polyIn/select", { matcher });
                const result = await this.pod.polyIn.select(matcher);
                this.logger.finished("polyIn/select", result);
                return result;
            },
            add: async (...quads) => {
                this.logger.called("polyIn/add", { quads });
                await this.pod.polyIn.add(...quads);
                this.logger.finished("polyIn/add");
            }
        };
    }

    get polyOut(): PolyOut {
        return {
            httpRequest: async (url, method, body?, headers?) => {
                this.logger.called("polyOut/httpRequest", { url, method, body, headers });
                const result = await this.pod.polyOut.httpRequest(url, method, body, headers);
                this.logger.finished("polyIn/httpRequest", result);
                return result;
            },
            readFile: async (path, options) => {
                this.logger.called("polyOut/readFile", { path, options });
                const result = await this.pod.polyOut.readFile(path, options);
                this.logger.finished("polyIn/readFile", result);
                return result;
            }
        };
    }

}