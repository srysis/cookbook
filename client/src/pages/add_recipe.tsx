import { useState } from 'react'

import axios from '../api/axios.ts'

function AddRecipe() {
	const [recipe_data, setRecipeData] = useState<any>({name: "", description: "", ingredients: ""});

	function onChangeHandler(event: any) {
		setRecipeData({
			...recipe_data,
			[event.target.id]: event.target.value
		})
	}

	function onSubmitHandler(event: any) {
		event.preventDefault();

		axios.post(`/recipe`, {recipe_data: recipe_data})
		.then((response: any) => {
			console.log(response);
		})
		.catch((error: any) => {
			console.error(error);
		})
	}

	return(
		<form onSubmit={onSubmitHandler}>
			<br />
			<input type="text" id="name" placeholder="Name" onChange={onChangeHandler} required />
			<br /><br />
			<input type="text" id="description" placeholder="Description" onChange={onChangeHandler} />
			<br /><br />
			<input type="text" id="ingredients" placeholder="Ingredients" onChange={onChangeHandler} required />
			<br /><br />
			<button>Add</button>
		</form>
	)
}

export default AddRecipe;