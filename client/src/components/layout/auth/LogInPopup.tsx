import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../../api/axios'

import "../../../style/auth/login_popup.css"

interface props {
	logIn: Function,
	setLoginPopupVisible: Function
}

function LogInPopup({ logIn, setLoginPopupVisible }: props) {
	const userRef: any = useRef(null);

	const [user_credentials, setUserCredentials] = useState<{username: string, password: string} | {}>({});

	const navigate = useNavigate();

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		userRef.current?.focus();
	}, [])

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
		<div id="login_popup" onClick={() => { if (event.target.id == "login_popup") setLoginPopupVisible(false) }}>
			<div className="form_container">
				<h1>Log In</h1>
				<form onSubmit={onSubmitHandler}>
					<div className="input_container">
						<label htmlFor="username"><span>Username</span></label>
						<input 
							type="text" 
							id="username" 
							ref={userRef} 
							autoComplete="off" 
							onChange={onChangeHandler} 
							required 
						/>
					</div>
					<div className="input_container">
						<label htmlFor="password"><span>Password</span></label>
						<input 
							type="password" 
							id="password" 
							onChange={onChangeHandler} 
							required 
						/>
					</div>
					<div className="submit_container">
						<button disabled={!user_credentials.username || !user_credentials.password}>Log In</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default LogInPopup;