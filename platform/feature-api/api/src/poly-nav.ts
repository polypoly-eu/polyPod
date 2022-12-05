/**
 * @interface ExternalFile holds info of an external file
 */
export interface ExternalFile {
    name: string;
    url: string;
    size: number;
}

/**
 * `PolyNav` specifies the interaction of the Feature with the host container. It is concerned with
 * user interactions with the container.
 */
export interface PolyNav {
    /**
     * A way for features to display the contents of a web page for the given URL.
     * @param {string} url - The URL to open.
     * @returns void
     */
    openUrl(url: string): Promise<void>;
    /**
     * Describe which actions are possible within the pod when a feature is loaded
     * @param {string[]} actions - A list of actions that the user can take.
     * @returns void
     */
    setActiveActions(actions: string[]): Promise<void>;
    /**
     * Set a title in a Pod
     * @param {string} title - The title to set
     * @returns void
     */
    setTitle(title: string): Promise<void>;
    /**
     * Asks the user to pick a file and returns it.
     * @param {string} [type] - The type of file the user selects, as a valid MIME type string. If no type is passed, the user can chose any type of file.
     * @throws if an unsupported MIME type was passed as the type argument.
     * @return A promise that resolves to an ExternalFile Object or `null` if the user cancelled.
     */
    pickFile(type?: string): Promise<ExternalFile | null>;
}
