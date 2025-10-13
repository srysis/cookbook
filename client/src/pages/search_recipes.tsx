import { useState } from 'react'

import axios from '../api/axios'

import Recipe from "../components/search_recipes/Recipe"

import "../style/search_page.css"

function SearchRecipes() {
	const [filtered_recipes, setFilteredRecipes] = useState<any>();
	const [ingredients_list, setIngredientsList] = useState<any>();

	const [isSearchFinished, setIsSearachFinished] = useState<boolean>(false);

	function onSubmitHandler(event: any) {
		event.preventDefault();

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
			<h1>Search</h1>
			<form onSubmit={onSubmitHandler}>
				<input type="text" autoComplete="off" />
				<button>Submit</button>
			</form>
			{ isSearchFinished && 
				<section id="matching_recipes">
					{filtered_recipes.length > 0 &&
						<>
							{filtered_recipes.map((recipe) => <Recipe key={recipe.id} recipe={recipe} ingredients_list={ingredients_list.split(/[ ,]+/)} />)}
						</>
					}
				</section>
			}
		</section>
	)
}

export default SearchRecipes;