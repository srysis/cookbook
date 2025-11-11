import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from "react-i18next";

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import axios from './api/axios'

import ProtectedRoutes from './tools/ProtectedRoutes'

import BaseLayout from './components/layout/Base'

import RecipesPage from './pages/recipes_page'
import SearchRecipesPage from './pages/search_recipes'
import AddRecipePage from './pages/add_recipe'
import RecipePage from './pages/recipe_page'

import LoginPage from './pages/auth/login_page'
import RegistrationPage from './pages/auth/registration_page'

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

	const [notification_visible, setNotificationVisible] = useState<boolean>(false);
	const [notification_type, setNotificationType] = useState<string>("");
	const [notification_message, setNotificationMessage] = useState<string>("");

	const { i18n } = useTranslation();

	useEffect(() => {
		if (!window.localStorage.getItem("lang")) {
			window.localStorage.setItem("lang", i18n.language);
		}
	}, [])

	useEffect(() => {
		if (stored_web_token && stored_user_ID) {

			axios.get(`/auth/verify/${stored_user_ID}`)
			.then((response: any) => {
				if (!response.data.success) logOut();
			})
			.catch(() => {
				logOut();
			});
		} else {
			logOut();
		}
	}, [isLoggedIn])

	useEffect(() => {
		if (notification_message !== "") {
			setNotificationVisible(true);

			setTimeout(() => {
				setNotificationVisible(false);
				setNotificationMessage("");
				setNotificationType("");
			}, 3000);
		}

		return () => { setNotificationVisible(false); }
	}, [notification_message])


	function setNotificationMessageWrapper(message: string) {
		setNotificationMessage(message)
	}

	function setNotificationTypeWrapper(type: string) {
		switch(type) {
			case "success":
				setNotificationType("success");
				break;
			case "error":
				setNotificationType("error");
				break;
			case "":
				setNotificationType("");
				break;
			default:
				console.error(`Values 'success' or 'error' are expected, but instead '${type}' was received`);
				break;
		}
	}

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

	const WIDTH_THRESHOLD = 550;

	const initial_device_type = window.innerWidth < WIDTH_THRESHOLD ? "mobile" : "desktop";

	const [DEVICE_TYPE, setDeviceType] = useState<string>(initial_device_type);

	window.addEventListener("resize", () => {
		if (window.innerWidth > WIDTH_THRESHOLD) {
			setDeviceType("desktop");
		} else {
			setDeviceType("mobile");
		}
	})

	return(
		<BrowserRouter basename="/">
			<Routes>
				<Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} logIn={logIn} />} />
				<Route path="/register" element={<RegistrationPage isLoggedIn={isLoggedIn} />} />
				<Route 
					element={<BaseLayout 
								DEVICE_TYPE={DEVICE_TYPE}
								isLoggedIn={isLoggedIn} 
								logIn={logIn} 
								logOut={logOut} 
								notification_visible={notification_visible} 
								notification_message={notification_message} 
								notification_type={notification_type} 
								setNotificationMessage={setNotificationMessageWrapper} 
								setNotificationType={setNotificationTypeWrapper} 
							/>
							}
				>
					<Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
						<Route path="/recipes" element={<RecipesPage />} />
						<Route path="/recipe/:id" element={<RecipePage setNotificationMessage={setNotificationMessageWrapper} setNotificationType={setNotificationTypeWrapper} />} />
						<Route path="/add_recipe" element={<AddRecipePage setNotificationMessage={setNotificationMessageWrapper} setNotificationType={setNotificationTypeWrapper} />} />
						<Route path="/search" element={<SearchRecipesPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
