const jwt = require('jsonwebtoken');

const database = require('../database.js');

function setOwnership(request, response, next) {	
	const token = request.headers['authorization'];
	const recipe_id = request.params.id;

	const select_recipe_query = "SELECT * FROM `recipes` WHERE `id` = " + recipe_id;

	database.query(select_recipe_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			try {
				const decoded_token = jwt.verify(token, access_key);

				if (decoded_token.id == data[0].made_by) {
					response.locals.ownership = true;
				} else {
					response.locals.ownership = false;
				}
			} catch (error) {
				if (error.name == "TokenExpiredError") {
					return response.status(401).json({success: false, message: "Passed token has been expired.", refreshable: true});
				} else {
					response.locals.ownership = false;
				}
			}
		} else {
			response.locals.ownership = false;
		}
		
		next();
	});
}

module.exports = setOwnership;