import { useState } from 'react'
import { useNavigate } from 'react-router'

import axios from '../api/axios.ts'

import LoadingSpinner from "../components/LoadingSpinnerInline.tsx"

import "../style/add_recipe_page.css"

interface props {
	setNotificationMessage: Function,
	setNotificationType: Function
}

function AddRecipe({setNotificationMessage, setNotificationType}: props) {
	const navigate = useNavigate();

	const [recipe_name, setRecipeName] = useState<string>("");
	const [recipe_short_description, setRecipeShortDescription] = useState<string>("");
	const [recipe_description, setRecipeDescription] = useState<string>("");

	const [doIngredientsExist, setIngredientsExist] = useState<boolean>(false);

	const [adding_in_progress, setAddingState] = useState<boolean>(false);

	function addInputField(event: any) {
		const ingredient_container: HTMLElement = document.createElement('div');
		ingredient_container.classList.add("ingredient_container");


		const input_field_HTML: HTMLInputElement = document.createElement('input');
		input_field_HTML.setAttribute("type", "text");
		input_field_HTML.setAttribute("name", "ingredient");
		input_field_HTML.classList.add("ingredient");
		input_field_HTML.addEventListener('keydown', onIngredientKeyDownHandler);

		const delete_input_field_button_HTML: HTMLButtonElement = document.createElement('button');
		delete_input_field_button_HTML.setAttribute("type", "button");
		delete_input_field_button_HTML.addEventListener('click', removeInputField);
		delete_input_field_button_HTML.innerHTML = 'X';

		ingredient_container.appendChild(input_field_HTML);
		ingredient_container.appendChild(delete_input_field_button_HTML);


		event.target.parentElement.insertBefore(ingredient_container, document.querySelector("button#add_ingredient"));

		input_field_HTML.focus();


		if (!doIngredientsExist) {
			setIngredientsExist(true);
		}
	}

	function removeInputField(event: any) {
		event.target.parentElement.remove();

		const ingredient_containers = document.querySelectorAll("div.ingredient_container");

		if (ingredient_containers.length == 0) {
			setIngredientsExist(false);
		}
	}

	function onIngredientKeyDownHandler(event: any) {
		if (event.which == 13 || event.keyCode == 13 || event.code == "Enter") {
			event.preventDefault();
			
			const add_ingredient_button: HTMLButtonElement | null = document.querySelector("button#add_ingredient");

			if (add_ingredient_button != null) {
				add_ingredient_button.click();
			}
		}
	}

	function clearFields() {
		const input_fields = document.querySelectorAll("input[type='text'], textarea") as any;

		for (let input_field of input_fields) {
			input_field.value = "";
		}

		const ingredient_containers = document.querySelectorAll("div.ingredient_container");

		for (let ingredient_container of ingredient_containers) {
			ingredient_container.remove();
		}

		setRecipeName("");
		setRecipeDescription("");
		setRecipeShortDescription("");
	}

	function onNameOrDescriptionChangeHandler(event: any) {
		switch (event.target.id) {
			case "name":
				setRecipeName(event.target.value);
				break;
			case "description":
				setRecipeDescription(event.target.value);
				break;
			case "short_description":
				setRecipeShortDescription(event.target.value);
				break;
			default:
				console.error("Unexpected value");
				break;
		}
	}

	function onSubmitHandler(event: any) {
		event.preventDefault();
		
		const input_fields: NodeListOf<HTMLInputElement> = document.querySelectorAll("input.ingredient");

		if (input_fields.length == 0 || input_fields[0].value === "") {
			return;
		}

		let recipe_ingredients: string[] = [];

		for (let input_field of input_fields) {
			if (input_field.value !== "") recipe_ingredients.push(input_field.value);
		}

		setAddingState(true);


		axios.post(`/recipe`, {user_id: window.localStorage.getItem("id"), recipe_data: {
			name: recipe_name,
			description: recipe_description,
			short_description: recipe_short_description,
			ingredients: recipe_ingredients
		}})
		.then((response: any) => {
			if (response.data.success) {
				setAddingState(false);
				setNotificationType("success");
				setNotificationMessage("Recipe was successfully added");
				navigate(`/recipe/${response.data.inserted_ID}`)
			}
		})
		.catch((error: any) => {
			setAddingState(false);
			if (!error.response.data.success) {
				window.location.reload();
			}
		})
	}

	return(
		<section id="add_recipe">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="name"><span>Recipe name*</span></label>
					<input type="text" id="name" placeholder="Name your recipe" onChange={onNameOrDescriptionChangeHandler} autoComplete="off" required />
				</div>
				<div className="input_wrapper">
					<label><span>Ingredients(at least one)</span></label>
					<div className="input_container">
						<button type="button" id="add_ingredient" onClick={addInputField}>+ Add ingredient</button>
					</div>
				</div>
				<div className="input_container">
					<label htmlFor="short_description"><span>Short description*</span></label>
					<input type="text" id="short_description" placeholder="Give your recipe a brief description" onChange={onNameOrDescriptionChangeHandler} autoComplete="off" required />
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
					<button type="button" disabled={adding_in_progress} onClick={() => clearFields()}>Clear</button>
					<button type="submit" disabled={!recipe_name || !recipe_short_description || !doIngredientsExist || adding_in_progress}>{adding_in_progress ? <LoadingSpinner /> : "Add recipe"}</button>
				</div>
			</form>
		</section>
	)
}

export default AddRecipe;