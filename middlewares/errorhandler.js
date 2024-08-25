
const errorHandler = (err, req, res, next) => {
	
	const statusCode =  400;
	const message = err.message || "Something went wrong.";

	return res.status(statusCode).json({
		status: statusCode,
		message: message
	})
}

module.exports = errorHandler;