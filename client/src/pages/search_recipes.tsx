import { useState, useRef, useEffect } from 'react'

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
	const ingredientsRef = useRef<HTMLInputElement | null>(null);

	const [filtered_recipes, setFilteredRecipes] = useState<Array<Recipe>>([]);
	const [ingredients_list, setIngredientsList] = useState<string[]>([]);

	const [isSearchFinished, setIsSearachFinished] = useState<boolean>(false);

	const [ingredients_list_to_send, setIngredientsListToSend] = useState<string[]>([]);

	useEffect(() => {
		ingredientsRef.current?.focus();
	}, []);

	function removeIngredientFromList(event: any) {
		let new_ingredients_list = ingredients_list;

		new_ingredients_list = new_ingredients_list.filter((item, index) => { return index != event.currentTarget.dataset.index });

		setIngredientsList(new_ingredients_list);
	}

	function onKeyDownHandler(event: any) {
		// code 13 is 'Enter' and code 188 is ','

		if ((event.which == 13 || event.keyCode == 13 || event.code == "Enter") ||
			(event.which == 188 || event.keyCode == 188 || event.code == "Comma")) {
			event.preventDefault();

			if (event.target.value && !ingredients_list.includes(event.target.value)) {
				setIngredientsList([...ingredients_list, event.target.value]);
			}

			event.target.value = "";
		}
	}

	function onBlurHandler(event: any) {
		event.preventDefault();

		if (event.target.value && !ingredients_list.includes(event.target.value)) {
			setIngredientsList([...ingredients_list, event.target.value]);
		}

		event.target.value = "";
	}

	function onSubmitHandler(event: any) {
		event.preventDefault();

		setFilteredRecipes([]);

		setIngredientsListToSend(() => {
			const temp_ingredients_list = ingredients_list;

			if (temp_ingredients_list) {
				let query = new URLSearchParams(Object.assign({}, temp_ingredients_list));
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

			return temp_ingredients_list;
		})
	}

	return(
		<section id="search">
			<form onSubmit={onSubmitHandler}>
				<div className="search_bar_wrapper" onClick={() => ingredientsRef.current?.focus()}>
					<div className="search_bar">
						{ ingredients_list.length > 0 && 
							<div className="ingredients">
								{ingredients_list.map((ingredient, index) => 
									<span className="ingredient_wrapper" key={index} data-index={index} onClick={removeIngredientFromList}>
										<span className="ingredient">{ingredient}</span>
										<button type="button">X</button>
									</span>
								)}
							</div>
						}
						<div className="input_container">
							<input 
								type="text"
								ref={ingredientsRef}  
								id="ingredients" 
								placeholder="Add ingredient..." 
								autoComplete="off" 
								onKeyDown={onKeyDownHandler} 
								onBlur={onBlurHandler}
							/>
						</div>
					</div>
					
					
				</div>
				<div className="submit_container"><button type="submit">Search</button></div>
			</form>
			<section id="matching_recipes">
				{ isSearchFinished && filtered_recipes.length > 0 && 
					<>
						{filtered_recipes.map((recipe) => <Recipe key={recipe.id} recipe={recipe} ingredients_list={ingredients_list_to_send} />)}
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