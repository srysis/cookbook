import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Recipe from "../components/home/Recipe"
import LoadingSpinner from "../components/LoadingSpinnerBlock.tsx"

import "../style/home.css"

type Recipe = {
	id: number,
	name: string,
	description: string,
	short_description: string,
	ingredients: string
}

function Home() {
	const [recipes, setRecipes] = useState<Array<Recipe>>([]);
	const [areRecipesRetrieved, setRecipesRetrieved] = useState<boolean>(false);

	const [isLoading, setLoadingState] = useState<boolean>(true);

	useEffect(() => {
		setRecipesRetrieved(false);
		setLoadingState(true);

		axios.get(`/recipes`)
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
			<section id="home">
				{recipes && recipes.map((recipe) => <Recipe key={recipe.id} content={recipe} />)}
			</section>
		)
	} else if (isLoading) {
		return(
			<LoadingSpinner />
		)
	}
}

export default Home;