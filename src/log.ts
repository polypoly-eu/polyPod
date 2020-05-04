import {Pod, PolyIn, PolyOut} from "@polypoly-eu/poly-api";

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
            fetch: async (input, init) => {
                this.logger.called("polyOut/fetch", { input, init });
                const result = await this.pod.polyOut.fetch(input, init);
                this.logger.finished("polyIn/fetch", result);
                return result;
            },
            readFile: async (path, options) => {
                this.logger.called("polyOut/readFile", { path, options });
                const result = await this.pod.polyOut.readFile(path, options);
                this.logger.finished("polyIn/readFile", result);
                return result;
            },
            writeFile: async (path, contents, options) => {
                this.logger.called("polyOut/writeFile", { path, contents, options });
                await this.pod.polyOut.writeFile(path, contents, options);
                this.logger.finished("polyIn/writeFile");
            },
            stat: async path => {
                this.logger.called("polyOut/stat", { path });
                await this.pod.polyOut.stat(path);
                this.logger.finished("polyIn/stat");
            }
        };
    }

}