import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from "./Header.tsx"
import LogInPopup from "./auth/LogInPopup.tsx"

interface props {
	isLoggedIn: boolean,
	logIn: Function,
	logOut: Function
}

function Base({isLoggedIn, logIn, logOut}: props) {
	const [isLoginPopupVisible, setLoginPopupVisible] = useState<boolean>(false);

	function setLoginPopupVisibleWrapper(value: boolean) {
		setLoginPopupVisible(value);
	}

	return(
		<>
			<Header isLoggedIn={isLoggedIn} logOut={logOut} setLoginPopupVisible={setLoginPopupVisibleWrapper} />
			{ !isLoggedIn && isLoginPopupVisible && 
				<LogInPopup logIn={logIn} setLoginPopupVisible={setLoginPopupVisibleWrapper} />
			}
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;