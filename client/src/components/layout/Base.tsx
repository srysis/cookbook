import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import Header from "./Header.tsx"
import Aside from "./Aside.tsx"

import Notification from "../Notification.tsx"

interface props {
	DEVICE_TYPE: string,
	logOut: Function,
	notification_visible: boolean,
	notification_message: string,
	notification_type: string,
	setNotificationMessage: Function,
	setNotificationType: Function
}

function Base({DEVICE_TYPE, logOut, notification_visible, notification_message, notification_type, setNotificationMessage, setNotificationType}: props) {
	const [isAsideVisible, toggleAside] = useState<boolean>(false);

	useEffect(() => {
		if (isAsideVisible) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [isAsideVisible])


	function toggleAsideWrapper(value: boolean) {
		toggleAside(value);
	}

	return(
		<>
			{ isAsideVisible && <Aside toggleAside={toggleAsideWrapper} logOut={logOut} /> }
			<Header DEVICE_TYPE={DEVICE_TYPE} logOut={logOut} toggleAside={toggleAsideWrapper} />
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