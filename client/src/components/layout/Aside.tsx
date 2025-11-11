import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import "../../style/mobile/layout/aside.css"

interface props {
	toggleAside: Function,
	visibility: boolean,
	isLoggedIn: boolean,
	logOut: Function
}

function Aside({ toggleAside, visibility, isLoggedIn, logOut } : props) {
	const { t } = useTranslation();

	function onInteractHandler() {
		toggleAside(false);
	}

	return(
		<aside className={visibility ? "active" : ""}>
			<div className="overlay" onClick={onInteractHandler}></div>
			<div id="content">
				<span><Link to="/search" onClick={onInteractHandler}>{t('search.title')}</Link></span>
				<button className="log_out_button" onClick={() => logOut()}>{t('header.logOut')}</button>
			</div>
		</aside>
	)
}

export default Aside;