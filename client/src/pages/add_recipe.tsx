import { useState } from 'react'
import { useNavigate } from 'react-router'

import axios from '../api/axios.ts'

import "../style/add_recipe_page.css"

function AddRecipe() {
	const navigate = useNavigate();

	const [recipe_name, setRecipeName] = useState<string>("");
	const [recipe_description, setRecipeDescription] = useState<string>("");

	const [doIngredientsExist, setIngredientsExist] = useState<boolean>(false);

	function addInputField(event: any) {
		const input_field_HTML: HTMLInputElement = document.createElement('input');
		input_field_HTML.setAttribute("type", "text");
		input_field_HTML.classList.add("ingredient");
		input_field_HTML.setAttribute("placeholder", "e.g. cheese, bread, etc.");

		event.target.parentElement.insertBefore(input_field_HTML, document.querySelector("button#add_ingredient")).focus();

		if (!doIngredientsExist) {
			setIngredientsExist(true);
		}
	}

	function clearFields() {
		const input_fields = document.querySelectorAll("input[type='text'], textarea") as any;

		for (let input_field of input_fields) {
			input_field.value = "";
		}

		setRecipeName("");
		setRecipeDescription("");
	}

	function onNameOrDescriptionChangeHandler(event: any) {
		switch (event.target.id) {
			case "name":
				setRecipeName(event.target.value);
				break;
			case "description":
				setRecipeDescription(event.target.value);
				break;
			default:
				console.error("Unexpected value");
				break;
		}
	}

	function onSubmitHandler(event: any) {
		event.preventDefault();
		
		const input_fields = document.querySelectorAll("input.ingredient");

		if (input_fields.length == 0 || input_fields[0].value === "") {
			return;
		}

		let recipe_ingredients: string[] = [];

		for (let input_field of input_fields) {
			if (input_field.value !== "") recipe_ingredients.push(input_field.value);
		}


		axios.post(`/recipe`, {user_id: window.localStorage.getItem("id"), recipe_data: {
			name: recipe_name,
			description: recipe_description,
			ingredients: recipe_ingredients
		}})
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
					<input type="text" id="name" placeholder="Name your recipe" onChange={onNameOrDescriptionChangeHandler} autoComplete="off" required />
				</div>
				<div className="input_wrapper">
					<label><span>Ingredients</span></label>
					<div className="input_container">
						<button type="button" id="add_ingredient" onClick={addInputField}>+ Add ingredient</button>
					</div>
				</div>
				<div className="input_container">
					<label htmlFor="description"><span>Additional information(optional)</span></label>
					<textarea 
						id="description" 
						placeholder="Things like how to cook properly or just the description of an end result" 
						rows={4} 
						cols={40} 
						maxLength={5000} 
						onChange={onNameOrDescriptionChangeHandler} 
					/>
				</div>
				<div className="buttons_container">
					<button type="button" onClick={() => clearFields()}>Clear</button>
					<button type="submit" disabled={!recipe_name || !doIngredientsExist}>Add recipe</button>
				</div>
			</form>
		</section>
	)
}

export default AddRecipe;