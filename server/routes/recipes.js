const express = require('express');

const database = require('../database.js');

const authenticator = require('../middlewares/authenticator.js')

const router = express.Router();

router.get('/recipes', (request, response) => {
	const query = "SELECT * FROM `recipes`";

	database.query(query, (error, data) => {
		if (error) return response.json(error);

		response.json({recipes: data})
	})
});

router.get('/recipe/:id', (request, response) => {
	const recipe_id = request.params.id;

	const get_recipe_query = "SELECT * FROM `recipes` WHERE `id` = " + recipe_id;

	database.query(get_recipe_query, (error, data) => {
		if (error) return response.json(error);

		response.json({recipe_info: data[0]});
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

router.get('/filter_recipes', (request, response) => {
	const ingredients = Object.values(request.query);

	const query = "SELECT * FROM `recipes` WHERE MATCH(`ingredients`) AGAINST ('" + ingredients + "')";

	database.query(query, (error, data) => {
		if (error) return response.json(error);

		response.json(data);
	})
});

module.exports = router;