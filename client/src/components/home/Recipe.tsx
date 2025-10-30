import { Link } from 'react-router-dom'

interface props {
	content: {
		id: number,
		name: string,
		description: string,
		short_description: string,
		ingredients: string
	}
}

function Recipe({content}: props) {
	const { id, name, short_description, ingredients } = content;
	
	return(
		<div className="recipe">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/recipe/${id}`}></Link>
				</div>
				<div className="name"><h2>{name}</h2></div>
				<div className="ingredients">
					{ingredients.split(",").map((ingredient, index) => <span key={index}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</span>)}
				</div>
				<div className="description">
					<p>{short_description}</p>
				</div>
			</div>
		</div>
	)
}

export default Recipe;