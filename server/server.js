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

app.get('/api/recipe', (request, response) => {
	const search_queue = request.query.queue;
})


app.listen(process.env.PORT || port, () => {console.log(`Cookbook API running on port ${port}`)});