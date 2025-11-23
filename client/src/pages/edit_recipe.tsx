import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useParams } from 'react-router-dom'
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

function EditRecipe({setNotificationMessage, setNotificationType}: props) {
	const location = useLocation();

	const { initial_name, initial_description, initial_short_description, initial_ingredients } = location.state;

	const navigate = useNavigate();

	const { id } = useParams();

	const { t } = useTranslation();

	const [initial_info_field_height, setInitialInfoFieldHeight] = useState<number | null>(null);
	const [current_info_field_height, setCurrentInfoFieldHeight] = useState<number | null>(null);

	const [recipe_name, setRecipeName] = useState<string>(initial_name);
	const [recipe_short_description, setRecipeShortDescription] = useState<string>(initial_short_description);
	const [recipe_description, setRecipeDescription] = useState<string>(initial_description);

	const [recipe_name_length, setRecipeNameLength] = useState<number>(initial_name.length);
	const [recipe_short_description_length, setRecipeShortDescriptionLength] = useState<number>(initial_short_description.length);
	const [recipe_description_length, setRecipeDescriptionLength] = useState<number>(initial_description.length);

	const [doIngredientsExist, setIngredientsExist] = useState<boolean>(initial_ingredients.split(",").length > 0);

	const [editing_in_progress, setEditingState] = useState<boolean>(false);

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

		if (document.querySelectorAll("div.ingredient_container").length == 0) {
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

	function resetFields() {
		(document.querySelector("input[id='name']") as HTMLInputElement)!.value = initial_name;
		(document.querySelector("input[id='short_description']") as HTMLInputElement)!.value = initial_short_description;
		(document.querySelector("textarea[id='description']") as HTMLInputElement)!.value = initial_description;


		setRecipeName(initial_name);
		setRecipeDescription(initial_description);
		setRecipeShortDescription(initial_short_description);

		setRecipeNameLength(initial_name.length);
		setRecipeDescriptionLength(initial_description.length);
		setRecipeShortDescriptionLength(initial_short_description.length);


		const ingredient_containers = document.querySelectorAll("div.ingredient_container");

		for (let ingredient_container of ingredient_containers) {
			ingredient_container.remove();
		}


		const initial_ingredients_list = initial_ingredients.split(",");
		const input_container = document.querySelector("div.input_wrapper > div.input_container");

		for (let counter = 0; counter < initial_ingredients_list.length; counter++) {
			const ingredient_container: HTMLElement = document.createElement('div');
			ingredient_container.classList.add("ingredient_container");

			const input_field_HTML: HTMLInputElement = document.createElement('input');
			input_field_HTML.setAttribute("type", "text");
			input_field_HTML.setAttribute("name", "ingredient");
			input_field_HTML.classList.add("ingredient");
			input_field_HTML.addEventListener('keydown', onIngredientKeyDownHandler);
			input_field_HTML.setAttribute("value", initial_ingredients_list[counter]);

			const delete_input_field_button_HTML: HTMLButtonElement = document.createElement('button');
			delete_input_field_button_HTML.setAttribute("type", "button");
			delete_input_field_button_HTML.addEventListener('click', removeInputField);
			delete_input_field_button_HTML.innerHTML = 'X';

			ingredient_container.appendChild(input_field_HTML);
			ingredient_container.appendChild(delete_input_field_button_HTML);

			input_container!.insertBefore(ingredient_container, document.querySelector("button#add_ingredient"));
		}
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

		setEditingState(true);

		axios.patch(`/recipe/${id}`, {
			user_id: window.localStorage.getItem("id"), 
			recipe_data: {
				name: recipe_name,
				description: recipe_description,
				short_description: recipe_short_description,
				ingredients: recipe_ingredients
			}
		})
		.then((response: any) => {
			if (response.data.success) {
				setEditingState(false);
				setNotificationType("success");
				setNotificationMessage("Recipe was successfully added");
				navigate(`/recipe/${id}`)
			}
		})
		.catch((error: any) => {
			setEditingState(false);
			if (!error.response.data.success) {
				window.location.reload();
			}
		})
	}

	return(
		<section id="edit_recipe">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container">
					<div className="label_wrapper">
						<label htmlFor="name"><span>{t("recipeForm.name")}</span></label>
						<span className="character_count">
							{recipe_name_length} / {document.querySelector("input#name")?.getAttribute("maxLength")}
						</span>
					</div>
					<input 
						type="text" 
						id="name" 
						defaultValue={initial_name}
						placeholder={t("recipeForm.namePlaceholder")} 
						onChange={onNameOrDescriptionChangeHandler} 
						autoComplete="off" 
						maxLength={150} 
						required 
					/>
				</div>
				<div className="input_wrapper">
					<label><span>{t("recipeForm.ingredients")}</span></label>
					<div className="input_container">
						{initial_ingredients.split(",").map((ingredient: any, index: any) => 
							<div key={index} className="ingredient_container initial">
								<input type="text" name="ingredient" className="ingredient" defaultValue={ingredient} onKeyDown={onIngredientKeyDownHandler} />
								<button type="button" onClick={removeInputField}>X</button>
							</div>
						)}
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
						defaultValue={initial_short_description}
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
						defaultValue={initial_description}
						placeholder={t("addRecipe.additionalInfoPlaceholder")}
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
					<button type="button" disabled={editing_in_progress} onClick={() => resetFields()}>{t("resetFields")}</button>
					<button type="submit" disabled={!recipe_name || !recipe_short_description || !doIngredientsExist || editing_in_progress}>
						{editing_in_progress ? <LoadingSpinner /> : <>{t("recipeForm.editRecipeButton")}</>}
					</button>
				</div>
			</form>
		</section>
	)
}

export default EditRecipe;