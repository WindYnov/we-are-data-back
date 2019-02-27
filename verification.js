const old_company = require('./models/model_companies');
const new_company = require('./models/model_new_companies');

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
			reject('Verification of company failed');
		}
	});
};