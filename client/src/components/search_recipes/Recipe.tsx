interface props {
	recipe: {
		id: number,
		name: string,
		description: string,
		ingredients: string
	}
}

function Recipe({recipe}: props) {
	const { id, name, description, ingredients } = recipe;

	return(
		<div className="recipe">
			<p>{name}</p>
			<p>{ingredients}</p>
		</div>
	)
}

export default Recipe;