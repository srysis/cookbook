interface props {
	content: {
		id: number,
		name: string,
		description: string,
		ingredients: string
	}
}

function Recipe({content}: props) {
	const { id, name, description, ingredients } = content;
	
	return(
		<div className="recipe">
			<h1>{name}</h1>
			<p>{description ? description : "no description"}</p>
			<p>{ingredients}</p>
		</div>
	)
}

export default Recipe;