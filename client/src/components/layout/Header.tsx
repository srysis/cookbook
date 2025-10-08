import { Link } from 'react-router-dom'

import "../../style/layout/header.css"

interface props {
	isLoggedIn: boolean,
	logOut: Function
}

function Header({isLoggedIn, logOut}: props) {
	const stored_user_id: any = window.localStorage.getItem('id');

	return(
		<header>
			<nav>
				{!isLoggedIn && 
					<> 
						<Link id="log_in_button" to="/login">Log In</Link>
					</> 
				}
				<Link to="/">Home</Link>
				<Link to="/search">Search recipes</Link>
				<Link to="/add_recipe">Add a new recipe</Link>
				{isLoggedIn && 
					<button onClick={logOut}>Log out</button>
				}
			</nav>
		</header>
	)
}

export default Header;