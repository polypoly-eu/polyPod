import {Ops} from "./_common";
import {serveCommand} from "./serve";
import {test} from "../test";

export interface TestCommandOps extends Ops {
    port: number;
}

export async function testCommand(options: TestCommandOps): Promise<void> {
    const server = await serveCommand({
        inmemory: true,
        log: false,
        open: false,
        port: options.port,
        dir: options.dir
    });

    try {
        await test(`http://localhost:${options.port}/`);
    }
    finally {
        console.log("Tests completed");
        server.close();
    }
}
