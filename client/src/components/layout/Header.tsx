import { Link } from 'react-router-dom'

import "../../style/layout/header.css"

interface props {
	isLoggedIn: boolean,
	logOut: Function,
	setLoginPopupVisible: Function
}

function Header({isLoggedIn, logOut, setLoginPopupVisible}: props) {
	return(
		<header>
			<div className="logo_container"><Link to="/">cookbook</Link></div>
			<nav>
				<span><Link to="/search">Search recipes</Link></span>
				{isLoggedIn &&
					<>
						<span><Link to="/add_recipe">Add a new recipe</Link></span>
						<button className="log_out_button" onClick={() => logOut()}>Log out</button>
					</>
				}
				{!isLoggedIn && 
					<button className="log_in_button" onClick={() => setLoginPopupVisible(true)}>Log in</button>
				}
			</nav>
		</header>
	)
}

export default Header;