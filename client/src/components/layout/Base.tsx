import { Outlet } from 'react-router-dom'

import Header from "./Header"

interface props {
	isLoggedIn: boolean,
	logOut: Function
}

function Base({isLoggedIn, logOut}: props) {
	return(
		<>
			<Header isLoggedIn={isLoggedIn} logOut={logOut} />
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;