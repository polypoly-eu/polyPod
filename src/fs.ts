export interface EncodingOptions {
    encoding: BufferEncoding;
}

export interface FS {
    readFile(path: string, options: EncodingOptions): Promise<string>;
    writeFile(path: string, content: string, options: EncodingOptions): Promise<void>;
    stat(path: string): Promise<void>;
}