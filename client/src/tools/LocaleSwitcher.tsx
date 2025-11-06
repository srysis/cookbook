import { useTranslation } from "react-i18next";
import { supportedLngs } from "./i18n.ts";

export default function LocaleSwitcher() {
	const { i18n } = useTranslation();

	return (
		<div>
			<div className="locale-switcher">
			<select
				id="lang_switch"
				value={i18n.resolvedLanguage}
				onChange={(e) => { i18n.changeLanguage(e.target.value).then(() => {window.localStorage.setItem("lang", i18n.language)});  } }
			>
				{Object.entries(supportedLngs).map(([code, name]) => (
					<option value={code} key={code}>
						{name}
					</option>
				))}
			</select>
			</div>
		</div>
	);
}