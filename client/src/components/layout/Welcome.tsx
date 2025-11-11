import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router-dom'

import "../../style/layout/welcome.css"

interface props {
	isLoggedIn: boolean
}

function WelcomeLayout({isLoggedIn}: props) {
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/recipes");
		}
	}, [])

	return(
		<div id="welcome_wrapper">
			<main>
				<Outlet />
			</main>
		</div>
	)
}

export default WelcomeLayout;