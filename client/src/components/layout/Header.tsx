import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";

import LocaleSwitcher from "../LocaleSwitcher";

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
	const { t } = useTranslation();

	return(
		<header>
			{ DEVICE_TYPE === "mobile" && 
				<div id="aside_toggler">
					<button type="button" onClick={() => {toggleAside(true)}}><img src={bars_solid} /></button>
				</div>
			}
			<div className="logo_wrapper">
				<Link to="/recipes">cookbook</Link>
				<LocaleSwitcher />
			</div>
			{ DEVICE_TYPE === "desktop" &&
				<nav>
					<span><Link to="/search">{t('search.title')}</Link></span>
					{isLoggedIn &&
						<>
							<button className="log_out_button" onClick={() => logOut()}>{t('header.logOut')}</button>
						</>
					}
					{!isLoggedIn && 
						<button className="log_in_button" onClick={() => setLoginPopupVisible(true)}>{t("header.logIn")}</button>
					}
				</nav>
			}
		</header>
	)
}

export default Header;