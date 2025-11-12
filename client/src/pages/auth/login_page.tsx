import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next';

import axios from '../../api/axios'

import LoadingSpinner from "../../components/LoadingSpinnerInline.tsx"

import error_icon from "../../assets/exclamation-mark-2.png"

import "../../style/auth/login_page.css"
import "../../style/auth/shared.css"

import "../../style/mobile/auth/login_page.css"

type UserCredentials = {
	username: string,
	password: string
}

interface props {
	isLoggedIn: boolean,
	logIn: Function
}

function LogInPage({ isLoggedIn, logIn }: props) {
	const userRef: any = useRef(null);

	const { t } = useTranslation();

	const [user_credentials, setUserCredentials] = useState<UserCredentials>({username: "", password: ""});

	const [login_in_progress, setLoggingInState] = useState<boolean>(false);
	const [login_failed, setLoginFailed] = useState<boolean>(false);
	const [error_message, setErrorMessage] = useState<string>("");

	const navigate = useNavigate();

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		userRef.current?.focus();
	}, [])

	useEffect(() => {
		setErrorMessage("");
		setLoginFailed(false);
	}, [user_credentials]);

	function onChangeHandler(event: any) {
		setUserCredentials({
			...user_credentials,
			[event.target.id]: event.target.value
		})
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		setLoggingInState(true);
		setLoginFailed(false);
		setErrorMessage("");

		try {
			const response = await axios.post('/auth/login', user_credentials, { headers: REQUEST_HEADERS });

			if (response.data.success) {
				logIn(response.data);

				setLoggingInState(false);
				navigate("/recipes");
			}
		} catch (error: any) {
			setLoggingInState(false);
			setLoginFailed(true);

			if (error.status === 404) {
				setErrorMessage(t("error.invalidCredentials"));
			}
		}
	}

	return(
		<>
			{ !isLoggedIn && 
				<section id="login">
					<div className="form_container">
						<p className="login_title">
							<Trans i18nKey="auth.logIn">
								Log in to <span>Cookbook</span>
							</Trans>
						</p>
						<form onSubmit={onSubmitHandler}>
							{ login_failed && 
								<div id="error_container">
									<div className="image_container">
										<img src={error_icon} />
									</div>
									<div className="text_container">
										<p>{error_message}</p>
									</div>
								</div>
							}
							<div className="input_container">
								<label htmlFor="username"><span>{t("auth.username")}</span></label>
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
								<label htmlFor="password"><span>{t("auth.password")}</span></label>
								<input 
									type="password" 
									id="password" 
									onChange={onChangeHandler} 
									required 
								/>
							</div>
							<div className="submit_container">
								<button type="submit" disabled={!user_credentials.username || !user_credentials.password || login_in_progress}>{login_in_progress ? <LoadingSpinner /> : <>{t("auth.logInButton")}</>}</button>
							</div>
							<div className="register_tip">
								<p>
									<Trans i18nKey="registerTip">
										Don't have an account yet? <Link to="/register">Register now!</Link>
									</Trans>
								</p>
							</div>
						</form>
					</div>
				</section>
			}
		</>
	)
}

export default LogInPage;