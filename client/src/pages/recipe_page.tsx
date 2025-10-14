import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from '../api/axios'

import "../style/recipe_page.css"

type Recipe = {
	id: number,
	name: string,
	description: string,
	ingredients: string
}

function RecipePage() {
	const { id } = useParams();

	const [recipe_info, setRecipeInfo] = useState<Recipe>({id: 0, name: "", description: "", ingredients: ""});
	const [infoFetched, setInfoFetched] = useState<boolean>(false);

	useEffect(() => {
		axios.get(`/recipe/${id}`)
		.then((response: any) => {
			setRecipeInfo(response.data.recipe_info);

			setInfoFetched(true);
		})
		.catch((error: any) => {
			console.error(error);
		})
	}, [])

	if (infoFetched) {
		const { name, description, ingredients } = recipe_info;

		const recipe_ingredients: string[] = ingredients.split(/[ ,]+/);
		const ingredients_list: string[] = Object.values(Object.fromEntries(new URLSearchParams(window.location.search)));

		let matching_ingredients_HTML: any = [];
		let non_matching_ingredients_HTML: any = [];

		recipe_ingredients.map((recipe_ingredient, index) => {
			if (ingredients_list.includes(recipe_ingredient)) {
				matching_ingredients_HTML.push(<span key={index} className="matching_ingredient">{recipe_ingredient.charAt(0).toUpperCase() + recipe_ingredient.slice(1)}</span>);
			} else {
				non_matching_ingredients_HTML.push(<span key={index}>{recipe_ingredient.charAt(0).toUpperCase() + recipe_ingredient.slice(1)}</span>);
			}
		});
		

		return(
			<section id="recipe">
				<div className="name"><h1>{name}</h1></div>
				<div className="ingredients">{matching_ingredients_HTML}{non_matching_ingredients_HTML}</div>
				<hr />
				<div className="description">
					<p>{description ? description : "no description"}</p>
				</div>
			</section>
		)
	}
}

export default RecipePage;