export class ApiSuccess {
    constructor({ message = 'Success', data = null, meta = null, statusCode = 200 } = {}) {

        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.meta = meta;
        this.timestamp = new Date().toISOString();
    }
}