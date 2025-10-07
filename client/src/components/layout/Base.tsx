import { Outlet } from 'react-router-dom'

function Base() {
	return(
		<>
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;