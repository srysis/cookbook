import { useState } from 'react'

import axios from '../api/axios'

import Recipe from "../components/search_recipes/Recipe"

import "../style/search_page.css"

type Recipe = {
	id: number,
	name: string,
	description: string,
	ingredients: string
}

function SearchRecipes() {
	const [filtered_recipes, setFilteredRecipes] = useState<Array<Recipe>>([]);
	const [ingredients_list, setIngredientsList] = useState<string>("");

	const [isSearchFinished, setIsSearachFinished] = useState<boolean>(false);

	function onSubmitHandler(event: any) {
		event.preventDefault();

		setFilteredRecipes([]);

		setIngredientsList(() => {
			const new_ingredients_list = (event.target.elements[0].value);

			if (new_ingredients_list) {
				let query = new URLSearchParams(Object.assign({}, new_ingredients_list.split(",")));
				let queryString = query.toString();

				axios.get(`/filter_recipes?${queryString}`)
				.then((response: any) => {
					setFilteredRecipes(response.data);

					setIsSearachFinished(true);
				})
				.catch((error: any) => {
					console.error(error);
				})
			}

			return new_ingredients_list;
		})
	}

	return(
		<section id="search">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container"><input type="search" id="ingredients" placeholder="Filter by ingredients..." autoComplete="off" /></div>
				<div className="submit_container"><button>Search</button></div>
			</form>
			<section id="matching_recipes">
				{ isSearchFinished && filtered_recipes.length > 0 && 
					<>
						{filtered_recipes.map((recipe) => <Recipe key={recipe.id} recipe={recipe} ingredients_list={ingredients_list.split(/[ ,]+/)} />)}
					</>
				}
				{ isSearchFinished && filtered_recipes.length <= 0 &&
					<p>No recipes that match given ingredients were found.</p>
				}
			</section>
		</section>
	)
}

export default SearchRecipes;