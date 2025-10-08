const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const database = require('../database.js')

const router = express.Router();

router.post('/register', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	const check_username_query = "SELECT * FROM `users` WHERE `username` = '" + username + "'";

	database.query(check_username_query, (error, data) => {
		if (error) return response.json(error);

		const rehashes_count = 13;

		if (!data.length) {
			bcrypt.hash(password, rehashes_count)
			.then((hash) => {
				const register_query = "INSERT INTO `users` (`username`, `password`) VALUES ('" + username + "', '" + hash + "');"

				database.query(register_query, (error, data) => {
					if (error) return response.status(500).json(error);

					return response.json({success: true, message: data});
				})
			})
			.catch(error => {
				console.error(error)
			})
		} else {
			response.status(409).json({success: false, message: "Username is already taken."});
		}
	})
});

router.post('/login', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	const find_username_query = "SELECT * FROM `users` WHERE `username` = '" + username + "'";

	database.query(find_username_query, (error, data) => {
		if (error) return response.json(error);

		if (data.length) {
			bcrypt.compare(password, data[0].password)
			.then((result) => {
				if (result) {
					const access_token = jwt.sign({ id: data[0].id }, access_key, { expiresIn: '1h' });

					const refresh_token = jwt.sign({ id: data[0].username }, refresh_key, { expiresIn: '7d' });

					response.cookie('t', refresh_token, {
						httpOnly: true,
						path: '/',
						secure: true,
						sameSite: "none",
						maxAge: 604800000
					});

					response.json({success: true, token: access_token, admin: data[0].admin, user_id: data[0].id});
				} else {
					response.status(404).json({success: false, message: 'Invaild credentials.'});
				}
			})
		} else {
			response.status(404).json({success: false, message: 'Invaild credentials.'});
		}
	})
});

router.post('/logout', (request, response) => {
	response.clearCookie('t', {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: "none"
	})

	response.json({success: true, message: "Logged out."});
})

module.exports = router;