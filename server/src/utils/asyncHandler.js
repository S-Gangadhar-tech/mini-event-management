// asyncHandler.js

const asyncHandler = (requestHandler) => {
    // It must return a new function (the middleware)
    return (req, res, next) => {
        // Execute the handler, wrap it in a Promise, and catch any errors
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    }
}

export default asyncHandler