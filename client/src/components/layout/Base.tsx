import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import Header from "./Header.tsx"

import LogInPopup from "./auth/LogInPopup.tsx"

import Notification from "../Notification.tsx"

interface props {
	isLoggedIn: boolean,
	logIn: Function,
	logOut: Function,
	notification_visible: boolean,
	notification_message: string,
	notification_type: string,
	setNotificationMessage: Function,
	setNotificationType: Function
}

function Base({isLoggedIn, logIn, logOut, notification_visible, notification_message, notification_type, setNotificationMessage, setNotificationType}: props) {
	const [isLoginPopupVisible, setLoginPopupVisible] = useState<boolean>(false);

	useEffect(() => {
		if (isLoginPopupVisible) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [isLoginPopupVisible])

	function setLoginPopupVisibleWrapper(value: boolean) {
		setLoginPopupVisible(value);
	}

	return(
		<>
			<Header isLoggedIn={isLoggedIn} logOut={logOut} setLoginPopupVisible={setLoginPopupVisibleWrapper} />
			{ !isLoggedIn && isLoginPopupVisible && 
				<LogInPopup logIn={logIn} setLoginPopupVisible={setLoginPopupVisibleWrapper} />
			}
			{notification_visible && 
				<Notification message={notification_message} type={notification_type} setNotificationMessage={setNotificationMessage} setNotificationType={setNotificationType} />
			}
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;