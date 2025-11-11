import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Recipe from "../components/recipes/Recipe"
import LoadingSpinner from "../components/LoadingSpinnerBlock.tsx"

import "../style/recipes.css"
import "../style/mobile/recipes.css"

type Recipe = {
	id: number,
	name: string,
	description: string,
	short_description: string,
	ingredients: string
}

function RecipesPage() {
	const [recipes, setRecipes] = useState<Array<Recipe>>([]);
	const [areRecipesRetrieved, setRecipesRetrieved] = useState<boolean>(false);

	const [isLoading, setLoadingState] = useState<boolean>(true);

	useEffect(() => {
		setRecipesRetrieved(false);
		setLoadingState(true);

		axios.get(`/recipes?id=${window.localStorage.getItem('id')}`)
		.then((response: any) => {
			setRecipes(response.data.recipes);
			setRecipesRetrieved(true);

			setLoadingState(false);
		})
		.catch((error: any) => {
			console.error(error);
		});
	}, []);

	if (areRecipesRetrieved && !isLoading && recipes != undefined) {
		return(
			<section id="recipes">
				{recipes && recipes.map((recipe) => <Recipe key={recipe.id} content={recipe} />)}
			</section>
		)
	} else if (isLoading) {
		return(
			<LoadingSpinner />
		)
	}
}

export default RecipesPage;