const express = require('express');
const jwt = require('jsonwebtoken');

const database = require('../database.js');

const authenticator = require('../middlewares/authenticator.js');
const checkOwner = require('../middlewares/checkOwner.js');

const router = express.Router();

router.get('/recipes', (request, response) => {
	const query = "SELECT * FROM `recipes`";

	database.query(query, (error, data) => {
		if (error) return response.json(error);

		response.json({recipes: data})
	})
});

router.get('/recipe/:id', checkOwner, (request, response) => {
	const recipe_id = request.params.id;

	const get_recipe_query = "SELECT * FROM `recipes` WHERE `id` = " + recipe_id;

	database.query(get_recipe_query, (error, data) => {
		if (error) return response.json(error);

		response.json({recipe_info: data[0], ownership: response.locals.ownership});
	})
})

router.post('/recipe', authenticator, (request, response) => {
	const user_id = request.body.user_id;
	const { name, description, ingredients } = request.body.recipe_data;

	const capitalized_name = name.charAt(0).toUpperCase() + name.slice(1);

	const add_recipe_query = "INSERT INTO `recipes` (`name`, `description`, `ingredients`, `made_by`) VALUES ('" + capitalized_name + "', '" + description + "', '" + ingredients + "', '" + user_id + "');"

	database.query(add_recipe_query, (error, data) => {
		if (error) return response.json(error);

		response.json({success: true, inserted_ID: data.insertId});
	})
})

router.delete('/recipe/:id', checkOwner, (request, response) => {
	const token = request.headers['authorization'];

	if (token) {
		const recipe_id = request.params.id;
		const user_id = request.body.user_id;

		const select_recipe_query = "SELECT * FROM `recipes` WHERE `id` = " + recipe_id;

		database.query(select_recipe_query, (error, data) => {
			if (error) return response.status(500).json({success: false, message: "Something went wrong."});

			if (!data.length) {
				return response.status(404).json({success: false, message: "Specified recipe does not exist."})
			}

			if (response.locals.ownership) {
				try {
					const decoded_token = jwt.verify(token, access_key);

					if (decoded_token.id == user_id) {
						const delete_recipe_query = "DELETE FROM `recipes` WHERE `id` = '" + recipe_id + "' AND `made_by` = '" + user_id + "'";

						database.query(delete_recipe_query, (error, data) => {
							if (error) return response.status(500).json({success: false, message: "Something went wrong."});

							response.json({success: true, message: "Recipe was successfully deleted."});
						})
					} else {
						response.status(403).json({success: false, message: "Passed token does not correspond to the passed user ID."});
					}
				} catch (error) {
					response.status(403).json({success: false, message: "Passed token is either invalid, modified or expired."});
				}
			} else {
				response.status(403).json({success: false, message: "Client is not allowed to delete this recipe."});
			}
		})
	} else {
		response.status(401).json({success: false, message: "No authorization header passed."});
	}
})

router.get('/filter_recipes', (request, response) => {
	const ingredients = Object.values(request.query);

	const query = "SELECT * FROM `recipes` WHERE MATCH(`ingredients`) AGAINST ('" + ingredients + "')";

	database.query(query, (error, data) => {
		if (error) return response.json(error);

		response.json(data);
	})
});

module.exports = router;