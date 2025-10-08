const express = require('express');
const cors = require('cors');
const dot_env = require('dotenv');
const cookieparser = require('cookie-parser');

const database = require('./database.js');

const authRoutes = require('./routes/auth.js');
const recipesRoutes = require('./routes/recipes.js');

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieparser());

dot_env.config();

global.port = process.env.PORT;
global.access_key = process.env.ACCESS_KEY;
global.refresh_key = process.env.REFRESH_KEY;

app.use('/api/auth', authRoutes);

app.use('/api/', recipesRoutes);

// root
app.get('/', (request, response) => {
	response.json(`Cookbook API is running. Awaiting instructions...`);
});

app.listen(process.env.PORT || port, () => {console.log(`Cookbook API running on port ${port}`)});