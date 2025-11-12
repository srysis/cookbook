import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router-dom'

import LocaleSwitcher from "../LocaleSwitcher.tsx"

import "../../style/layout/welcome.css"
import "../../style/mobile/layout/welcome.css"

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
		<main>
			<div id="welcome_wrapper">
				<div id="left_side">
					<LocaleSwitcher />
					<Outlet />
				</div>
			</div>
		</main>
	)
}

export default WelcomeLayout;