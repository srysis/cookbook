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

router.post('/recipe', (request, response) => {
	const { name, description, ingredients } = request.body.recipe_data;

	const add_recipe_query = "INSERT INTO `recipes` (`name`, `description`, `ingredients`) VALUES ('" + name + "', '" + description + "', '" + ingredients + "');"

	database.query(add_recipe_query, (error, data) => {
		if (error) return response.json(error);

		response.json({recipe_info: data, inserted_ID: data.insertID});
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