import { useTranslation } from "react-i18next";
import { supportedLngs } from "../tools/i18n.ts";

import globe_logo from "../assets/globe-logo.png"

import "../style/locale_switcher.css"
import "../style/mobile/locale_switcher.css"

function LocaleSwitcher() {
	const { i18n } = useTranslation();

	return (
		<div className="locale_switcher">
			<img src={globe_logo} />
			<select
				id="lang_switch"
				value={i18n.resolvedLanguage}
				onChange={(e) => { i18n.changeLanguage(e.target.value).then(() => {window.localStorage.setItem("lang", i18n.language)});  } }
			>
				{Object.entries(supportedLngs).map(([code]) => (
					<option value={code} key={code}>
						{code.toUpperCase()}
					</option>
				))}
			</select>
		</div>
	);
}

export default LocaleSwitcher;