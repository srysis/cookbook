import { useState } from 'react'
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

	const recipe_ingredients = ingredients.split(/[ ,]+/);

	let matching_ingredients_HTML = [];
	let matching_ingredients_amount = 0;

	let non_matching_ingredients_HTML = [];

	let isFullMatch = false;

	recipe_ingredients.map((recipe_ingredient, index) => {
		if (ingredients_list.includes(recipe_ingredient)) {
			matching_ingredients_HTML.push(<span key={index} className="matching_ingredient">{capitalize(recipe_ingredient)}</span>);
			matching_ingredients_amount++;
		}
	});

	recipe_ingredients.map((recipe_ingredient, index) => {
		if (!ingredients_list.includes(recipe_ingredient)) {
			non_matching_ingredients_HTML.push(<span key={index}>{capitalize(recipe_ingredient)}</span>);
		}
	});

	if (matching_ingredients_amount == recipe_ingredients.length) {
		isFullMatch = true;
	}

	return(
		<>
			<div className={isFullMatch ? "recipe match" : "recipe"}>
				<div className="link_container">
					<div className="overlay">
						<Link to={`/recipe/${id}`}></Link>
					</div>
					<div className="name"><h2>{name}</h2>{isFullMatch && <span className="hint">You can cook this!</span>}</div>
					<div className="description">
						<p>{description ? description : "no description"}</p>
					</div>
					<div className="ingredients">{matching_ingredients_HTML}{non_matching_ingredients_HTML}</div>
				</div>
			</div>
		</>
	)
}

export default Recipe;