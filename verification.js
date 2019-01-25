const mongoose = require('mongoose');
const old_company = mongoose.model('companies');
const new_company = mongoose.model('new_company');

exports.verify = (email) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get company by email
			const v1_company = await old_company.findOne({email});
			const v2_company = await new_company.findOne({email});
			if (v1_company || v2_company) {
				resolve(v1_company || v2_company);
			} else {
				reject('Data company not found');
			}
		} catch (err) {
			// Email not found
			console.log(err);
			reject('Verification of company failed');
		}
	});
};