export class ApiError extends Error {
    constructor({ message = 'Something went wrong', errors = null, statusCode = 500 } = {}) {
        super(message);

        this.success = false;
        this.message = message;
        this.statusCode = statusCode;
        this.errors = errors;
        this.timestamp = new Date().toISOString();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
