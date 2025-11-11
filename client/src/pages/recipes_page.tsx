import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";

import axios from '../api/axios'

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
	const { t } = useTranslation();

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

	if (areRecipesRetrieved && !isLoading) {
		return(
			<section id="recipes">
				{recipes && recipes.map((recipe) => <Recipe key={recipe.id} content={recipe} />)}
				<div id="add_recipe">
					<div className="link_container">
						<div className="overlay">
							<Link to={`/add_recipe`}></Link>
						</div>
						<div className="content">
							<p>+ {t('addRecipe.title')}</p>
						</div>
					</div>
				</div>
			</section>
		)
	} else if (isLoading) {
		return(
			<LoadingSpinner />
		)
	}
}

export default RecipesPage;