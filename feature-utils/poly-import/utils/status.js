export class Status {
    constructor({ name, isSuccess, message = null }) {
        this.name = name;
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
