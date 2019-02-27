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
		return next(res.status(200).send({
			token: false,
			message: "Access to this resources is not accorded, your access is not defined",
			err: err
		}));
	}
};