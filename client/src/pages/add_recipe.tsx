import { useState } from 'react'
import { useNavigate } from 'react-router'

import axios from '../api/axios.ts'

import "../style/add_recipe_page.css"

function AddRecipe() {
	const navigate = useNavigate();

	const [recipe_data, setRecipeData] = useState<any>({name: "", description: "", ingredients: ""});

	function clearFields() {
		const input_fields = document.querySelectorAll("input[type='text'], textarea") as any;

		for (let input_field of input_fields) {
			input_field.value = "";

			setRecipeData({name: "", description: "", ingredients: ""});
		}
	}

	function onChangeHandler(event: any) {
		setRecipeData({
			...recipe_data,
			[event.target.id]: event.target.value
		})
	}

	function onSubmitHandler(event: any) {
		event.preventDefault();

		axios.post(`/recipe`, {user_id: window.localStorage.getItem("id"), recipe_data: recipe_data})
		.then((response: any) => {
			if (response.data.success) {
				navigate(`/recipe/${response.data.inserted_ID}`)
			}
		})
		.catch((error: any) => {
			if (!error.response.data.success) {
				window.location.reload();
			}
		})
	}

	return(
		<section id="add_recipe">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="name"><span>Recipe name</span></label>
					<input type="text" id="name" placeholder="Name your recipe" onChange={onChangeHandler} autoComplete="off" required />
				</div>
				<div className="input_container">
					<label htmlFor="ingredients"><span>Ingredients that are required in the recipe</span></label>
					<input type="text" id="ingredients" placeholder="e.g. cheese, bread, etc." onChange={onChangeHandler} autoComplete="off" required />
				</div>
				<div className="input_container">
					<label htmlFor="description"><span>Additional information(optional)</span></label>
					<textarea 
						id="description" 
						placeholder="Things like how to cook properly or just the description of an end result" 
						rows={4} 
						cols={40} 
						maxLength={5000} 
						onChange={onChangeHandler} 
					/>
				</div>
				<div className="buttons_container">
					<button type="button" onClick={() => clearFields()}>Clear</button>
					<button type="submit" disabled={!recipe_data.name || !recipe_data.ingredients}>Add recipe</button>
				</div>
			</form>
		</section>
	)
}

export default AddRecipe;