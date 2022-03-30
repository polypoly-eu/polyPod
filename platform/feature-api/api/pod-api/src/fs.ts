/**
 * Type definitions for a stripped-down version of Node.js' built-in [fs module](https://nodejs.org/api/fs.html); more
 * specifically, the Promise-based API. Main interface is [[FS]].
 *
 * The definitions are modelled after the [@types/node](https://www.npmjs.com/package/@types/node) package.
 *
 * @packageDocumentation
 */

export interface EncodingOptions {
    encoding: BufferEncoding;
}

export interface Stats {
    isFile(): boolean;
    isDirectory(): boolean;
    getTime(): string;
    getSize(): number;
    getName(): string;
    getId(): string;
}

/**
 * A stripped-down version of the Promise-based filesystem API from Node.js.
 *
 * The [Node.js documentation](https://nodejs.org/api/fs.html) applies to the methods in this interface.
 */
export interface FS {
    readFile(path: string, options: EncodingOptions): Promise<string>;
    readFile(path: string): Promise<Uint8Array>;
    writeFile(path: string, content: string, options?: EncodingOptions): Promise<string>;
    stat(path: string): Promise<Stats>;
    readdir(path: string): Promise<string[]>;
    importArchive(url: string): Promise<string>;
    removeArchive(fileId: string): Promise<void>;
}

export interface ExternalFile {
    name: string;
    url: string;
    size: number;
}
