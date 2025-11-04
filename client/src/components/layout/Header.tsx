import { Link } from 'react-router-dom'

import bars_solid from "../../assets/bars-solid.png"

import "../../style/layout/header.css"
import "../../style/mobile/layout/header.css"

interface props {
	DEVICE_TYPE: string,
	isLoggedIn: boolean,
	logOut: Function,
	setLoginPopupVisible: Function,
	toggleAside: Function
}

function Header({DEVICE_TYPE, isLoggedIn, logOut, setLoginPopupVisible, toggleAside}: props) {
	return(
		<header>
			{ DEVICE_TYPE === "mobile" && 
				<div id="aside_toggler">
					<button type="button" onClick={() => {toggleAside(true)}}><img src={bars_solid} /></button>
				</div>
			}
			<div className="logo_container"><Link to="/">cookbook</Link></div>
			{ DEVICE_TYPE === "desktop" &&
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
			}
			
		</header>
	)
}

export default Header;