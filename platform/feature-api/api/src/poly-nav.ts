/**
 * A reference to a file that exists outside the polyPod.
 */
export interface ExternalFile {
    name: string;
    url: string;
    size: number;
}

/**
 * `PolyNav` allows Features to interact with the user outside the confines of
 * their container.
 */
export interface PolyNav {
    /**
     * Callbacks for actions the polyPod can trigger in the Feature.
     *
     * Some common actions the user can take in a Feature are understood by the
     * polyPod, and can therefore be triggered by its native user interface,
     * which will then invoke the appropriate callback.
     *
     * @see [[setActiveActions]] To set the actions that can be triggered.
     */
    actions?: {
        /**
         * Callback invoked for back navigation.
         */
        back?: () => void;

        /**
         * Callback invoked for searching in the current context.
         */
        search?: () => void;

        /**
         * Callback invoked for showing information in the current context.
         */
        info?: () => void;
    };

    /**
     * Opens a URL in an external browser - usually the user's default browser.
     * @param url - The URL to open.
     */
    openUrl(url: string): Promise<void>;

    /**
     * Sets the list of actions that the polyPod can trigger in the Feature, see
     * [[actions]]. Typically called regularly to enable and disable actions
     * depending on the current state of the Feature.
     *
     * @param actions - All actions that can be triggered, can be empty.
     */
    setActiveActions(actions: string[]): Promise<void>;

    /**
     * Sets the current title. Typically called regularly to show the user where
     * they are in the Feature.
     * @param title - The new title.
     */
    setTitle(title: string): Promise<void>;

    /**
     * Asks the user to pick a file outside the polyPod.
     *
     * @param type - The MIME type of the file the user should select. If
     * not specified, the user can select any file.
     * @throws Error If an unsupported MIME type was passed as the type
     * argument.
     * @returns A reference to the file the user selected, or `null` if they
     * cancelled.
     */
    pickFile(type?: string): Promise<ExternalFile | null>;
}
