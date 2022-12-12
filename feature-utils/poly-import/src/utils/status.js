/**
 * Represents the status after running an {@link Importer}.
 */
export class Status {
    /**
     * Creates a new instance.
     * @param name - The type of status; see {@link statusTypes}.
     * @param [message] - The status message.
     */
    constructor({ name, message = null }) {
        /**
         * The type of status.
         * @see {@link statusTypes}
         */
        this.name = name;

        /**
         * Indicates whether the status represents success (`true`) or failure
         * (`false`).
         */
        this.isSuccess =
            name === statusTypes.success || name === statusTypes.warning;

        /** The status message. */
        this.message = message;
    }
}

/** Possible names for {@link Status} objects. */
export const statusTypes = {
    success: "Success",
    warning: "Warning",
    error: "Error",
};
