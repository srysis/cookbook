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
					const access_token = jwt.sign({ id: data[0].id }, access_key, { expiresIn: '12h' });

					const refresh_token = jwt.sign({ id: data[0].username }, refresh_key, { expiresIn: '30d' });

					response.cookie('t', refresh_token, {
						httpOnly: true,
						path: '/',
						secure: true,
						sameSite: "none",
						maxAge: 2592000000
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

router.get('/verify/:id', (request, response) => {
	const token = request.headers['authorization'];

	if (token) {
		const user_id = request.params.id;

		try {
			const decoded_token = jwt.verify(token, access_key);

			if (decoded_token.id == user_id) { 
				let isAdmin;

				const find_user_query = "SELECT `id` FROM `users` WHERE `id` = " + decoded_token.id;

				database.query(find_user_query, (error, data) => {
					if (error) return response.json(error);

					if (data[0].admin == 1) isAdmin = data[0].admin;

					response.json({success: true, message: "User is logged in.", admin: isAdmin});
				})

			} else {
				response.status(401).json({success: false, message: "Passed token does not correspond to the passed user ID.", refreshable: false});
			}

		} catch (error) {
			if (error.name == "TokenExpiredError") {
				response.status(401).json({success: false, message: "Passed token has been expired.", refreshable: true});
			} else {
				response.status(401).json({success: false, message: "Passed token is either invalid or modified.", refreshable: false});
			}
		}
	} else {
		response.status(401).json({success: false, message: "User is not logged in."})
	}
});

router.post('/refresh/:id', (request, response) => {
	const user_id = request.params.id;

	if (request.cookies?.t) {
		const refresh_token = request.cookies.t;

		const find_user_query = "SELECT `username` FROM `users` WHERE `id` = " + user_id;

		try {
			const decoded_refresh_token = jwt.verify(refresh_token, refresh_key);

			database.query(find_user_query, (error, data) => {
				if (error) return response.json(error);

				if (data[0].username == decoded_refresh_token.id) {
					const access_token = jwt.sign({ id: user_id }, access_key, { expiresIn: '12h' });

					response.json({success: true, token: access_token});
				} else {
					response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."});
				}
			})
		} catch (error) {
			response.status(401).json({success: false, message: "Passed token is either invalid, modified or expired."});
		}
	} else {
		response.status(401).json({success: false, message: "Passed token is either invalid or modified"});
	}
})

module.exports = router;