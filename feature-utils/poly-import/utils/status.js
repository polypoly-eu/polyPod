export class Status {
    constructor({ name, message = null }) {
        this.name = name;
        this.isSuccess =
            name === statusTypes.success || name === statusTypes.warning;
        this.message = message;
    }
}

export const statusTypes = {
    success: "Success",
    warning: "Warning",
    error: "Error",
};
