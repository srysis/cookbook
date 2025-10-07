const express = require('express');
const cors = require('cors');
const dot_env = require('dotenv');

const database = require('./database.js');

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

dot_env.config();

global.port = process.env.PORT;

// root
app.get('/', (request, response) => {
	response.json(`Cookbook API is running. Awaiting instructions...`);
});

app.get('/api/recipes', (request, response) => {
	const query = "SELECT * FROM `recipes`";

	database.query(query, (error, data) => {
		if (error) return response.json(error);

		response.json({recipes: data})
	})
});

app.post('/api/recipe', (request, response) => {
	const { name, description, ingredients } = request.body.recipe_data;

	const add_recipe_query = "INSERT INTO `recipes` (`name`, `description`, `ingredients`) VALUES ('" + name + "', '" + description + "', '" + ingredients + "');"

	database.query(add_recipe_query, (error, data) => {
		if (error) return response.json(error);

		response.json({data: data, inserted_ID: data.insertID});
	})
})

app.get('/api/filter_recipes', (request, response) => {
	const ingredients = Object.values(request.query);

	const query = "SELECT * FROM `recipes` WHERE MATCH(`ingredients`) AGAINST ('" + ingredients + "')";

	database.query(query, (error, data) => {
		if (error) return response.json(error);

		response.json(data);
	})
});


app.listen(process.env.PORT || port, () => {console.log(`Cookbook API running on port ${port}`)});