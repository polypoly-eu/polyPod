/**
 * `Entry` is used to store filesystem directory entries in a (roughly)
 * platform independent way.
 */
export interface Entry {
    id: string;
    path: string;
}

/**
 * @interface Stats about a file
 */
export interface Stats {
    id: string;
    size: number;
    time: string;
    name: string;
    directory: boolean;
}

/**
 * `PolyOut` specifies the interaction of the Feature with the environment.
 * It is concerned with file system operations and HTTP requests.
 *
 * Both of these aspects are separated out into their own modules:
 * - [[FS]] for Node.js-style file-system access
 */
export interface PolyOut {
    /**
     * It reads the file of the `path` given and returns its buffer.
     * @param {string} path - The path to the file to read.
     * @returns A promise that resolves to an Uint8Array buffer.
     */
    readFile(path: string): Promise<Uint8Array>;
    /**
     * Writes the given content to the given file path.
     * @param {string} path - The path to the file to write to.
     * @param {string} content - The content to write to the file.
     * @returns A promise that resolves to a file system object.
     */
    writeFile(path: string, content: string): Promise<void>;
    /**
     * It returns the stats of the file's path given:
     * id, size, time, name, and whether or not it's a directory
     * @param {string} path - The path to the file or directory.
     * @returns {Stats} A promise that resolves to a Stats object
     */
    stat(path: string): Promise<Stats>;
    /**
     * It imports an archive of the passed url into the destUrl specified.
     * @param {string} url - The URL of the archive to import.
     * @param {string} [destUrl] - The destination URL of the archive. If not specified, the archive will
     * be imported to the root of the file system.
     * @returns The URL of the imported archive.
     */
    importArchive(url: string, destUrl?: string): Promise<string>;
    /**
     * It removes an archive.
     * @param {string} fileId - The id of the file to be removed.
     * @returns A promise that resolves to a value of type `void`.
     */
    removeArchive(fileId: string): Promise<void>;
    /**
     * It reads the directory at the given path, and returns a
     * promise that resolves to an array of [[Entry]] objects
     * @param {string} pathToDir The system-dependent path to read.
     * @returns A promise with id-path pairs [[Entry]] as payload.
     */
    readDir(pathToDir: string): Promise<Entry[]>;
}
