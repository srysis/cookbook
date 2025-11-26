import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from "react-i18next"

import axios from '../api/axios.ts'

import LoadingSpinner from "../components/LoadingSpinnerInline.tsx"

import "../style/add_edit_recipe_page.css"
import "../style/tablet/add_edit_recipe_page.css"
import "../style/mobile/add_edit_recipe_page.css"

interface props {
	setNotificationMessage: Function,
	setNotificationType: Function
}

function AddRecipe({setNotificationMessage, setNotificationType}: props) {
	const navigate = useNavigate();

	const { t } = useTranslation();

	const [initial_info_field_height, setInitialInfoFieldHeight] = useState<number | null>(null);
	const [current_info_field_height, setCurrentInfoFieldHeight] = useState<number | null>(null);

	const [recipe_name, setRecipeName] = useState<string>("");
	const [recipe_short_description, setRecipeShortDescription] = useState<string>("");
	const [recipe_description, setRecipeDescription] = useState<string>("");

	const [recipe_name_length, setRecipeNameLength] = useState<number>(0);
	const [recipe_short_description_length, setRecipeShortDescriptionLength] = useState<number>(0);
	const [recipe_description_length, setRecipeDescriptionLength] = useState<number>(0);

	const [doIngredientsExist, setIngredientsExist] = useState<boolean>(false);

	const [adding_in_progress, setAddingState] = useState<boolean>(false);

	useEffect(() => {
		const info_field: HTMLElement | null = document.querySelector("textarea#description");

		if (info_field != null) {
			setInitialInfoFieldHeight(info_field.clientHeight);
			setCurrentInfoFieldHeight(info_field.clientHeight);
		}
	}, [])

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

		setRecipeNameLength(0);
		setRecipeDescriptionLength(0);
		setRecipeShortDescriptionLength(0);
	}

	function onInputHandler(event: any) {
		event.target.style.height = "auto";
		event.target.style.height = `${event.target.scrollHeight + 5}px`;

		setCurrentInfoFieldHeight(event.target.scrollHeight);
	}

	function onBlurHandler(event: any) {
		event.target.style.height = `${initial_info_field_height}px`;
	}

	function onFocusHandler(event: any) {
		event.target.style.height = `${current_info_field_height}px`;
	}

	function onNameOrDescriptionChangeHandler(event: any) {
		switch (event.target.id) {
			case "name":
				setRecipeName(event.target.value);
				setRecipeNameLength(event.target.value.length);
				break;
			case "description":
				setRecipeDescription(event.target.value);
				setRecipeDescriptionLength(event.target.value.length);
				window.scrollTo(0, document.body.scrollHeight);
				break;
			case "short_description":
				setRecipeShortDescription(event.target.value);
				setRecipeShortDescriptionLength(event.target.value.length);
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
				setNotificationMessage(t("success.added"));
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
					<div className="label_wrapper">
						<label htmlFor="name"><span>{t("recipeForm.name")}</span></label>
						<span className="character_count">
							{recipe_name_length} / {document.querySelector("input#name")?.getAttribute("maxLength")}
						</span>
					</div>
					<input type="text" id="name" placeholder={t("recipeForm.namePlaceholder")} onChange={onNameOrDescriptionChangeHandler} autoComplete="off" maxLength={150} required />
				</div>
				<div className="input_wrapper">
					<label><span>{t("recipeForm.ingredients")}</span></label>
					<div className="input_container">
						<button type="button" id="add_ingredient" onClick={addInputField}>{t("recipeForm.addIngredient")}</button>
					</div>
				</div>
				<div className="input_container">
					<div className="label_wrapper">
						<label htmlFor="short_description"><span>{t("recipeForm.shortDescription")}</span></label>
						<span className="character_count">
							{recipe_short_description_length} / {document.querySelector("input#short_description")?.getAttribute("maxLength")}
						</span>
					</div>
					<input
						type="text" 
						id="short_description" 
						placeholder={t("recipeForm.shortDescriptionPlaceholder")} 
						onChange={onNameOrDescriptionChangeHandler} 
						autoComplete="off"
						maxLength={300}
						required 
					/>
				</div>
				<div className="input_container">
					<div className="label_wrapper">
						<label htmlFor="description"><span>{t("recipeForm.additionalInfo")}</span></label>
						<span className="character_count">
							{recipe_description_length} / {document.querySelector("textarea#description")?.getAttribute("maxLength")}
						</span>
					</div>
					<textarea 
						id="description" 
						placeholder={t("recipeForm.additionalInfoPlaceholder")}
						rows={10} 
						cols={40} 
						maxLength={10000} 
						onChange={onNameOrDescriptionChangeHandler} 
						onInput={onInputHandler}
						onFocus={onFocusHandler} 
						onBlur={onBlurHandler}
					/>
				</div>
				<div className="buttons_container">
					<button type="button" disabled={adding_in_progress} onClick={() => clearFields()}>{t("clearFields")}</button>
					<button type="submit" disabled={!recipe_name || !recipe_short_description || !doIngredientsExist || adding_in_progress}>
						{adding_in_progress ? <LoadingSpinner /> : <>{t("recipeForm.addRecipeButton")}</>}
					</button>
				</div>
			</form>
		</section>
	)
}

export default AddRecipe;