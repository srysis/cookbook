import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

import LoadingSpinner from "../../components/LoadingSpinnerInline.tsx"

import eye_icon from "../../assets/eye-icon.png"
import correct_icon from "../../assets/correct.png"
import incorrect_icon from "../../assets/incorrect.png"

import "../../style/auth/registration_page.css"

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

	const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

	const [matching_password, setMatchingPassword] = useState<string>("");
	const [doPasswordsMatch, setDoPasswordsMatch] = useState<boolean>(false);
	const [matching_password_focus, setMatchingPasswordFocus] = useState<boolean>(false);

	const [registration_in_progress, setRegistrationState] = useState<boolean>(false);

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

	function clearFields() {
		const input_fields = document.querySelectorAll("input[type='text'], input[type='password']") as any;

		for (let input_field of input_fields) {
			input_field.value = "";

			setUsername("");
			setPassword("");
			setMatchingPassword("");
		}
	}

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

		setRegistrationState(true);

		try {
			const register_response = await axios.post('/auth/register', { username: username, password: password } , { headers: REQUEST_HEADERS });

			if (register_response.data.success) {
				setRegistrationState(false);
				navigate('/');
			} else {
				window.location.reload();
			}

		} catch (error: any) {
			console.error(error);
			setRegistrationState(false);
		}
	}

	return(
		<>
			{ !isLoggedIn && 
				<section id="registration">
					<h1>Register</h1>
					<form onSubmit={onSubmitHandler}>
						<div className="input_container">
							<label htmlFor="username">
								<span>Username<img src={isUsernameValid ? correct_icon : incorrect_icon} /></span>
							</label>
							<input 
								type="text" 
								id="username" 
								ref={userRef} 
								autoComplete="off" 
								onClick={() => setPasswordVisible(false)} 
								onChange={onChangeHandler} 
								onFocus={() => setUsernameFocus(true)} 
								onBlur={() => setUsernameFocus(false)} 
								required 
							/>
							<div id="username_note" className={username_focus && !isUsernameValid ? "visible" : ""}>
								<h3>Username must:</h3>
								<p>Be 4 to 24 characters long</p>
								<p>Start with a letter(regardless of case)</p>
							</div>
						</div>
						<div className="input_container">
							<label htmlFor="password">
								<span>Password<img src={isPasswordValid ? correct_icon : incorrect_icon} /></span>
							</label>
							<div className="container">
								<input 
									type={isPasswordVisible ? "text" : "password"}
									id="password" 
									onClick={() => setPasswordVisible(false)} 
									onChange={onChangeHandler} 
									onFocus={() => setPasswordFocus(true)} 
									onBlur={() => setPasswordFocus(false)} 
									required 
								/>
								<button type="button" onClick={() => setPasswordVisible(!isPasswordVisible)}>
									<img src={eye_icon} className={isPasswordVisible ? "selected" : ""} />
								</button>
							</div>
							<div id="password_note" className={password_focus && !isPasswordValid ? "visible" : ""}>
								<h3>Password must:</h3>
								<p>Be 8 to 24 characters long</p>
								<p>Contain one uppercase and one lowercase letters and a number</p>
							</div>
						</div>
						<div className="input_container">
							<label htmlFor="match_password">
								<span>Confirm password<img src={password && isPasswordValid && doPasswordsMatch ? correct_icon : incorrect_icon} /></span>
							</label>
							<input 
								type="password" 
								id="match_password" 
								onClick={() => setPasswordVisible(false)} 
								onChange={onChangeHandler} 
								onFocus={() => setMatchingPasswordFocus(true)} 
								onBlur={() => setMatchingPasswordFocus(false)} 
								required 
							/>
							<div id="matching_password_note" className={matching_password_focus && password && isPasswordValid && !doPasswordsMatch ? "visible" : ""}>
								<p>Must match the password in the "Password" field</p>
							</div>
						</div>
						<div className="buttons_container">
							<button type="button" onClick={clearFields} disabled={registration_in_progress}>Clear</button>
							<button type="submit" disabled={!isUsernameValid || !isPasswordValid || !doPasswordsMatch || registration_in_progress ? true : false}>
								{ registration_in_progress ? <LoadingSpinner /> : "Register" }
							</button>
						</div>
					</form>
				</section>
			}
		</>
	)
}

export default RegistrationPage;