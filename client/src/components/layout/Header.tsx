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
			<div className="logo_container"><Link to="/">Cookbook</Link></div>
			<nav>
				<span><Link to="/search">Search recipes</Link></span>
				{isLoggedIn &&
					<>
						<span><Link to="/add_recipe">Add a new recipe</Link></span>
						<button className="log_out_button" onClick={logOut}>Log out</button>
					</>
				}
				{!isLoggedIn && 
					<span className="log_in_button"> 
						<Link id="log_in_button" to="/login">Log In</Link>
					</span> 
				}
			</nav>
		</header>
	)
}

export default Header;