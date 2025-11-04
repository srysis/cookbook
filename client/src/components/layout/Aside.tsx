import { Link } from 'react-router-dom'

import "../../style/mobile/layout/aside.css"

interface props {
	toggleAside: Function,
	visibility: boolean,
	isLoggedIn: boolean,
	logOut: Function
}

function Aside({ toggleAside, visibility, isLoggedIn, logOut } : props) {

	function onInteractHandler() {
		toggleAside(false);
	}

	return(
		<aside className={visibility ? "active" : ""}>
			<div className="overlay" onClick={onInteractHandler}></div>
			<div id="content">
				{!isLoggedIn && 
					<span> 
						<Link id="log_in_button" to="/login" onClick={onInteractHandler}>Log In</Link>
					</span> 
				}
				<span><Link to="/search" onClick={onInteractHandler}>Search recipes</Link></span>
				{ isLoggedIn && 
					<> 
						<span><Link to="/add_recipe" onClick={onInteractHandler}>Add a new recipe</Link></span>
						<button className="log_out_button" onClick={() => logOut()}>Log out</button>
					</>
				}
			</div>
		</aside>
	)
}

export default Aside;