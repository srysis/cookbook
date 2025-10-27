import loading_spinner from "../assets/loading_spinner.png"

import "../style/loader.css"

function LoadingSpinnerBlock() {
	return(
		<div className="loading_spinner"><img src={loading_spinner}/></div>
	)
}

export default LoadingSpinnerBlock;