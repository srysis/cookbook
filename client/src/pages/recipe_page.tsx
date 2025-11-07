import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next"

import axios from '../api/axios'

import LoadingSpinnerBlock from "../components/LoadingSpinnerBlock.tsx"
import LoadingSpinnerInline from "../components/LoadingSpinnerInline.tsx"

import delete_icon from "../assets/trash_can.png"

import "../style/recipe_page.css"
import "../style/mobile/recipe_page.css"

type Recipe = {
	id: number,
	name: string,
	description: string,
	short_description: string,
	ingredients: string
}

interface props {
	setNotificationMessage: Function,
	setNotificationType: Function
}

function RecipePage({setNotificationMessage, setNotificationType}: props) {
	const navigate = useNavigate();

	const { id } = useParams();

	const { t } = useTranslation();

	const [recipe_info, setRecipeInfo] = useState<Recipe>({id: 0, name: "", description: "", short_description: "", ingredients: ""});
	const [isLoading, setLoadingState] = useState<boolean>(true);
	const [infoFetched, setInfoFetched] = useState<boolean>(false);

	const [ownership, setOwnership] = useState<boolean>(false);

	const [isDeletePopupVisible, showDeletePopup] = useState<boolean>(false);

	const [delete_in_progress, setDeletionState] = useState<boolean>(false);

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		setLoadingState(true);

		axios.get(`/recipe/${id}`)
		.then((response: any) => {
			setRecipeInfo(response.data.recipe_info);

			setOwnership(response.data.ownership);

			setInfoFetched(true);
			setLoadingState(false);
		})
		.catch((error: any) => {
			console.error(error);
		})
	}, [])

	async function deleteRecipe(event: any) {
		event.preventDefault();

		setDeletionState(true);

		try {
			const delete_response = await axios.delete(`/recipe/${id}`, {
				headers: REQUEST_HEADERS,
				data: {
					user_id: window.localStorage.getItem("id")
				}
			});

			if (delete_response.data.success) {
				setNotificationType("success");
				setNotificationMessage("Recipe was successfully deleted")
				navigate('/');
			} else {
				navigate(`/recipe/${id}`);
			}
		} catch (error: any) {
			console.error(error);
		}
	}

	if (infoFetched && !isLoading && recipe_info != undefined) {
		const { name, description, short_description, ingredients } = recipe_info;

		const recipe_ingredients: string[] = ingredients.split(",");
		const ingredients_list: string[] = Object.values(Object.fromEntries(new URLSearchParams(window.location.search)));

		let matching_ingredients_HTML: any = [];
		let non_matching_ingredients_HTML: any = [];

		recipe_ingredients.map((recipe_ingredient, index) => {
			if (ingredients_list.includes(recipe_ingredient)) {
				matching_ingredients_HTML.push(<span key={index} className="matching_ingredient">{recipe_ingredient.charAt(0).toUpperCase() + recipe_ingredient.slice(1)}</span>);
			} else {
				non_matching_ingredients_HTML.push(<span key={index}>{recipe_ingredient.charAt(0).toUpperCase() + recipe_ingredient.slice(1)}</span>);
			}
		});

		return(
			<>
				{ isDeletePopupVisible && 
					<div className="delete_popup_overlay" onClick={(event: any) => {if (event.target.classList.contains("delete_popup_overlay")) showDeletePopup(false) }}>
						<div className="delete_popup_container">
							<h1>{t("deleteRecipe.title")}</h1>
							<div className="selection_container">
								<button type="button" onClick={deleteRecipe} disabled={delete_in_progress ? true : false}>
									{delete_in_progress ? <LoadingSpinnerInline /> : <>{t("deleteRecipe.confirm")}</>}
								</button>
								<button type="button" onClick={() => {showDeletePopup(false)}} disabled={delete_in_progress ? true : false}>
									{t("deleteRecipe.deny")}
								</button>
							</div>
						</div>
					</div>
				}
				<section id="recipe">
					<div className="recipe_wrapper">
						<div className="main_info">
							<div className="name"><h2>{name}</h2></div>
							<div className="ingredients">{matching_ingredients_HTML}{non_matching_ingredients_HTML}</div>
							<div className="short_description">{short_description}</div>
						</div>
						{ ownership && 
							<div className="delete">
								<button type="button" onClick={() => {showDeletePopup(true)}}><img src={delete_icon} /></button>
							</div>
						}
					</div>
					<hr />
					<div className="description">
						<p>{description ? description : <>{t("noInformationGiven")}</>}</p>
					</div>
				</section>
			</>
		)
	} else if (infoFetched && !isLoading && recipe_info == undefined) {
		setNotificationType("error");
		setNotificationMessage(t("error.noRecipeFound"));
		navigate("/");
	} else if (isLoading) {
		return(
			<LoadingSpinnerBlock />
		)
	}
}

export default RecipePage;