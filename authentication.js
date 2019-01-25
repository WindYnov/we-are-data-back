const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const old_company = mongoose.model('companies');
const new_company = mongoose.model('new_company');


exports.authenticate = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get company by email
			const auth_v1company = await old_company.findOne({email});
			const auth_v2company = await new_company.findOne({email});
			
			if (auth_v2company) {
				bcrypt.compare(password, auth_v2company.password, (err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						resolve(auth_v2company);
					}
				});
			} else if (auth_v1company) {
				if (auth_v1company.password) {
					bcrypt.compare(password, auth_v1company.password, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							resolve(auth_v1company);
						}
					});
				} else {
					reject('Your company is already register, but your password not found, please create go to create your password');
				}
			}
		} catch (err) {
			// Email not found
			reject('Authentication of company failed');
		}
	});
};