import { useState, useEffect } from 'react'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import axios from './api/axios.ts'

if (import.meta.env.PROD) {
	disableReactDevTools();
}

function App() {
	const [recipes, setRecipes] = useState<any>();
	const [filtered_recipes, setFilteredRecipes] = useState<any>();

	const [ingredients, setIngredients] = useState<any>();

	useEffect(() => {
		axios.get(`/recipes`)
		.then((response: any) => {
			setRecipes(response.data.recipes);
		})
		.catch((error: any) => {
			console.error(error);
		});
	}, []);

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
		})
		.catch((error: any) => {
			console.error(error);
		})
	}

	return(
		<>
			{recipes && recipes.map((recipe) => <p>{recipe.ingredients}</p>)}
			<form onSubmit={onSubmitHandler}>
				<input type="text" onChange={onChangeHandler} />
				<button>Submit</button>
			</form>
			{filtered_recipes && filtered_recipes.map((recipe) => <p>{recipe.name}</p>)}
		</>
	)
}

export default App
