import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

interface props {
	isLoggedIn: boolean,
	logIn: Function
}

function LoginPage({ isLoggedIn, logIn }: props) {
	const userRef: any = useRef(null);

	const [user_credentials, setUserCredentials] = useState<{username: string, password: string} | {}>({});

	const navigate = useNavigate();

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	function onChangeHandler(event: any) {
		setUserCredentials({
			...user_credentials,
			[event.target.id]: event.target.value
		})
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		try {
			const response = await axios.post('/auth/login', user_credentials, { headers: REQUEST_HEADERS });

			if (response.data.success) {
				logIn(response.data);

				navigate('/');
			}
		} catch (error: any) {
			console.error(error);
		}
	}

	return(
		<>
			{ !isLoggedIn && 
				<form onSubmit={onSubmitHandler}>
					<input 
						type="text" 
						id="username" 
						ref={userRef} 
						autoComplete="off" 
						onChange={onChangeHandler} 
						required 
					/>
					<br /><br />
					<input 
						type="password" 
						id="password" 
						onChange={onChangeHandler} 
						required 
					/>
					<br /><br />
					<button>Login</button>
				</form>
			}
		</>
	)
}

export default LoginPage;