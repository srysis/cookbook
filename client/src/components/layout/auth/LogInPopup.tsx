import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import axios from '../../../api/axios'

import "../../../style/auth/login_popup.css"

type UserCredentials = {
	username: string,
	password: string
}

interface props {
	logIn: Function,
	setLoginPopupVisible: Function
}

function LogInPopup({ logIn, setLoginPopupVisible }: props) {
	const userRef: any = useRef(null);

	const [user_credentials, setUserCredentials] = useState<UserCredentials>({username: "", password: ""});

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

				window.location.reload();
			}
		} catch (error: any) {
			console.error(error);
		}
	}

	return(
		<div id="login_popup" onClick={() => { if ((event?.target as HTMLElement).id == "login_popup") setLoginPopupVisible(false) }}>
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
						<button type="submit" disabled={!user_credentials.username || !user_credentials.password}>Log In</button>
					</div>
					<div className="register_tip">
						<p><Link to="/register" onClick={() => {setLoginPopupVisible(false)}}>Register now</Link> to be able to create your own recipes!</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default LogInPopup;