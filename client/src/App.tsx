import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import BaseLayout from './components/layout/Base'

import Home from './pages/home'
import SearchRecipesPage from './pages/search_recipes'
import AddRecipePage from './pages/add_recipe'
import RecipePage from './pages/recipe_page'

import RegistrationPage from './pages/auth/registration_page'
import LoginPage from './pages/auth/login_page'

if (import.meta.env.PROD) {
	disableReactDevTools();
}

function App() {
	const stored_web_token: string | number | null = window.localStorage.getItem('t');
	const stored_user_ID: string | number | null = window.localStorage.getItem('id');

	let logged_in = null;

	if (stored_web_token && stored_user_ID) {
		logged_in = true;
	} else {
		logged_in = false;
	}

	const [isLoggedIn, setLoggedInState] = useState<boolean>(logged_in);

	function logIn(login_data: any) {
		const token = login_data.token;
		const user_id = login_data.user_id;

		window.localStorage.setItem('t', token);
		window.localStorage.setItem('id', user_id);

		setLoggedInState(true);
	}

	function logOut() {
		if (stored_web_token && stored_user_ID) {
			axios.post('/auth/logout')
			.then((response: any) => {
				if (response.data.success) {
					setLoggedInState(false);

					window.localStorage.removeItem('t');
					window.localStorage.removeItem('id');

					window.location.reload();
				}
			})
		}
	}

	return(
		<BrowserRouter basename="/">
			<Routes>
				<Route element={<BaseLayout />} >
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<SearchRecipesPage />} />
					<Route path="/add_recipe" element={<AddRecipePage />} />
					<Route path="/recipe/:id" element={<RecipePage />} />

					<Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} logIn={logIn} />} />
					<Route path="/register" element={<RegistrationPage isLoggedIn={isLoggedIn} />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
