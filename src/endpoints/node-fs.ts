import {promises as _fs} from "fs";
import {ObjectEndpointSpec, ServerOf, ValueEndpointSpec} from "../rpc";

export type FSEndpoint = ObjectEndpointSpec<{
    readFile(path: string, options: { encoding: BufferEncoding; flag?: string | number }): ValueEndpointSpec<string>;
}>;

export function fsEndpoint(fs: typeof _fs): ServerOf<FSEndpoint> {
    return {
        readFile(path: string, options: { encoding: BufferEncoding; flag?: string | number }): Promise<string> {
            return fs.readFile(path, options);
        }
    };
}