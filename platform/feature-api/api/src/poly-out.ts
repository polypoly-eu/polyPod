/**
 * A directory entry.
 */
export interface Entry {
    /**
     * The ID for this entry, for usage with [[PolyOut]] APIs.
     */
    id: string;

    /**
     * The relative path to this entry, for display and analysis purposes.
     */
    path: string;
}

/**
 * Information about a file or directory.
 */
export interface Stats {
    id: string;
    size: number;
    time: string;
    name: string;
    directory: boolean;
}

/**
 * `PolyOut`, mysteriously named for historical reasons, allows Features to
 * store data on a virtual file system not accessible to other Features.
 *
 * The API is loosely modelled after a subset of [Node.js'
 * fsPromises](https://nodejs.org/api/fs.html#promises-api), with some polyPod
 * specific functionality on top.
 *
 * Instead of POSIX paths, `PolyOut` deals with IDs - platform-specific,
 * unambiguous references to files and directories. On some platforms, these may
 * be POSIX paths, but it could also be URLs or file handles. Manipulating IDs
 * directly is therefore discouraged.
 *
 * @see [[PolyIn]] for access to the polyPod's internal triplestore, which is
 * the recommended way of storing most data.
 */
export interface PolyOut {
    /**
     * Reads the file with the given `id`.
     * @param id - The ID of the file to read.
     * @returns The contents of the file.
     */
    readFile(id: string): Promise<Uint8Array>;

    /**
     * Writes the supplied `content` to the file at `id`.
     * @param id - The ID of the file to write to.
     * @param content - The content to write to the file.
     */
    writeFile(id: string, content: string): Promise<void>;

    /**
     * Returns information about a file or directory.
     * @param id - The ID of the file or directory to analyze.
     * @returns Information about the file or directory.
     */
    stat(id: string): Promise<Stats>;

    /**
     * Imports an archive stored outside the polyPod into the Feature's virtual
     * file system.
     * @param url - The URL of the archive to import.
     * @param destId - The desired destination ID the imported archive's
     * contents in the virtual file system. Will be generated if not specified.
     * @returns The ID of the imported archive's contents - same as `destId` if
     * specified.
     */
    importArchive(url: string, destId?: string): Promise<string>;

    /**
     * Removes a previously imported archive.
     * @param id - The ID of the archive to be removed.
     * @returns A promise that resolves to a value of type `void`.
     */
    removeArchive(id: string): Promise<void>;

    /**
     * Reads the directory at the given ID recursively and returns all entries.
     * @param id - The ID of the directory to read.
     * @returns A list of all entries within the supplied directory.
     */
    readDir(id: string): Promise<Entry[]>;
}
