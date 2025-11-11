import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router-dom'

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
		<>
			<main>
				<Outlet />
			</main>
		</>
	)
}

export default WelcomeLayout;