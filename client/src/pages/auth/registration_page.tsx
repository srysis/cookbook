import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

const USER_REGEX : RegExp = /^[a-zA-Z][a-zA-Z-_]{3,23}$/;
const PWD_REGEX : RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

interface props {
	isLoggedIn: boolean
}


function RegistrationPage({isLoggedIn}: props) {
	const userRef = useRef<HTMLInputElement | null>(null);

	const [username, setUsername] = useState<string>("");
	const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
	const [username_focus, setUsernameFocus] = useState<boolean>(false);

	const [password, setPassword] = useState<string>("");
	const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
	const [password_focus, setPasswordFocus] = useState<boolean>(false);

	const [matching_password, setMatchingPassword] = useState<string>("");
	const [doPasswordsMatch, setDoPasswordsMatch] = useState<boolean>(false);
	const [matching_password_focus, setMatchingPasswordFocus] = useState<boolean>(false);

	const navigate = useNavigate();

	const REQUEST_HEADERS: any = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		userRef.current?.focus();

		if (isLoggedIn) navigate('/');
	}, []);

	useEffect(() => {
		setIsUsernameValid(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setIsPasswordValid(PWD_REGEX.test(password));
		setDoPasswordsMatch(password === matching_password);
	}, [password, matching_password]);

	function onChangeHandler(event: any) {
		switch (event.target.id) {
			case "username":
				setUsername(event.target.value);
				break;
			case "password":
				setPassword(event.target.value);
				break;
			case "match_password":
				setMatchingPassword(event.target.value);
				break;
			default:
				console.error("Unexpected error.");
				break;
		}
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
			console.error("Missing credentials.");
			return;
		}

		try {
			const register_response = await axios.post('/auth/register', { username: username, password: password } , { headers: REQUEST_HEADERS });

			console.log(register_response)
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
						onFocus={() => setUsernameFocus(true)} 
						onBlur={() => setUsernameFocus(false)} 
						required 
					/>
					<br /><br />
					<input 
						type="password" 
						id="password" 
						onChange={onChangeHandler} 
						onFocus={() => setPasswordFocus(true)} 
						onBlur={() => setPasswordFocus(false)} 
						required 
					/>
					<br /><br />
					<input 
						type="password" 
						id="match_password" 
						onChange={onChangeHandler} 
						onFocus={() => setMatchingPasswordFocus(true)} 
						onBlur={() => setMatchingPasswordFocus(false)} 
						required 
					/>
					<br /><br />
					<button disabled={!isUsernameValid || !isPasswordValid || !doPasswordsMatch ? true : false}>
						Register!
					</button>
				</form>
			}
		</>
	)
}

export default RegistrationPage;