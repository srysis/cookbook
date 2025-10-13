import { Link } from 'react-router-dom'

interface props {
	recipe: {
		id: number,
		name: string,
		description: string,
		ingredients: string
	},
	ingredients_list: string[]
}

function Recipe({recipe, ingredients_list}: props) {
	const { id, name, description, ingredients } = recipe;

	function capitalize(word: string) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	let ingredients_HTML = [];

	return(
		<>
			{ingredients.split(/[ ,]+/).map((recipe_ingredient, index) => {
				if (ingredients_list.includes(recipe_ingredient)) {
					ingredients_HTML.push(<span key={index} className="matching_ingredient">{capitalize(recipe_ingredient)}</span>)
				}
			})}
			{ingredients.split(/[ ,]+/).map((recipe_ingredient, index) => {
				if (!ingredients_list.includes(recipe_ingredient)) {
					ingredients_HTML.push(<span key={index}>{capitalize(recipe_ingredient)}</span>)
				}
			})}
			<div className="recipe">
				<div className="link_container">
					<div className="overlay">
						<Link to={`/recipe/${id}`}></Link>
					</div>
					<div className="name"><h2>{name}</h2></div>
					<div className="description">
						<p>{description ? description : "no description"}</p>
					</div>
					<div className="ingredients">{ingredients_HTML}</div>
				</div>
			</div>
		</>
	)
}

export default Recipe;