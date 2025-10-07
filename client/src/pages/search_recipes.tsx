import { useState } from 'react'

import axios from '../api/axios'

import Recipe from "../components/search_recipes/Recipe"

function SearchRecipes() {
	const [filtered_recipes, setFilteredRecipes] = useState<any>();
	const [ingredients, setIngredients] = useState<any>();

	const [isSearchFinished, setIsSearachFinished] = useState<boolean>(false);

	function onChangeHandler(event) {
		setIngredients(event.target.value);
	}

	function onSubmitHandler(event: any) {
		event.preventDefault();

		let query = new URLSearchParams(Object.assign({}, ingredients.split(",")));
		let queryString = query.toString();

		axios.get(`/filter_recipes?${queryString}`)
		.then((response: any) => {
			console.log(response.data);
			setFilteredRecipes(response.data);

			setIsSearachFinished(true);
		})
		.catch((error: any) => {
			console.error(error);
		})
	}

	return(
		<section id="search">
			<h1>Search</h1>
			<form onSubmit={onSubmitHandler}>
				<input type="text" autoComplete="off" onChange={onChangeHandler} />
				<button>Submit</button>
			</form>
			{ isSearchFinished && 
				<section id="matching_recipes">
					{filtered_recipes.length > 0 &&
						<>
							{filtered_recipes.map((recipe) => <Recipe key={recipe.id} recipe={recipe} />)}
						</>
					}
				</section>
			}
		</section>
	)
}

export default SearchRecipes;