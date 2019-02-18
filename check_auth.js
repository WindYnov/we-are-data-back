const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		//console.log(token);
		const decoded = jwt.verify(token, config.JWT_SECRET);
		
		req.companyId = decoded.idToToken;
		req.companyEmail = decoded.emailToToken;
		
		next();
	} catch (err) {
		console.log(err);
		return next(res.send({
			token: false,
			message: "Access to this resources is not accorded, your access is not defined",
			err: err
		}));
	}
};