import { Outlet } from 'react-router-dom'

import Header from "./Header"

function Base() {
	return(
		<>
			<Header />
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;