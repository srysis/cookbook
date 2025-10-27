import loading_spinner from "../assets/loading_spinner.png"

import "../style/loader.css"

function LoadingSpinnerInline() {
	return(
		<span className="loading_spinner"><img src={loading_spinner}/></span>
	)
}

export default LoadingSpinnerInline;