import { Link } from 'react-router-dom'

import "../../style/layout/header.css"

function Header() {
	return(
		<header>
			<nav>
				<Link to="/">Home</Link>
				<Link to="/search">Search recipes</Link>
				<Link to="/add_recipe">Add a new recipe</Link>
			</nav>
		</header>
	)
}

export default Header;