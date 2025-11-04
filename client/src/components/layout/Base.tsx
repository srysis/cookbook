import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import Header from "./Header.tsx"
import Aside from "./Aside.tsx"

import LogInPopup from "./auth/LogInPopup.tsx"

import Notification from "../Notification.tsx"

interface props {
	DEVICE_TYPE: string,
	isLoggedIn: boolean,
	logIn: Function,
	logOut: Function,
	notification_visible: boolean,
	notification_message: string,
	notification_type: string,
	setNotificationMessage: Function,
	setNotificationType: Function
}

function Base({DEVICE_TYPE, isLoggedIn, logIn, logOut, notification_visible, notification_message, notification_type, setNotificationMessage, setNotificationType}: props) {
	const [isAsideVisible, toggleAside] = useState<boolean>(false);

	const [isLoginPopupVisible, setLoginPopupVisible] = useState<boolean>(false);

	useEffect(() => {
		if (isAsideVisible || isLoginPopupVisible) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [isAsideVisible, isLoginPopupVisible])

	function setLoginPopupVisibleWrapper(value: boolean) {
		setLoginPopupVisible(value);
	}

	function toggleAsideWrapper(value: boolean) {
		toggleAside(value);
	}

	return(
		<>
			{ isAsideVisible && <Aside toggleAside={toggleAsideWrapper} visibility={isAsideVisible} isLoggedIn={isLoggedIn} logOut={logOut} /> }
			<Header DEVICE_TYPE={DEVICE_TYPE} isLoggedIn={isLoggedIn} logOut={logOut} setLoginPopupVisible={setLoginPopupVisibleWrapper} toggleAside={toggleAsideWrapper} />
			{ !isLoggedIn && isLoginPopupVisible && DEVICE_TYPE === "desktop" &&
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