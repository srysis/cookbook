import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import axios from '../api/axios'

import delete_icon from "../assets/trash_can.png"

import "../style/recipe_page.css"

type Recipe = {
	id: number,
	name: string,
	description: string,
	ingredients: string
}

function RecipePage() {
	const navigate = useNavigate();

	const { id } = useParams();

	const [recipe_info, setRecipeInfo] = useState<Recipe>({id: 0, name: "", description: "", ingredients: ""});
	const [infoFetched, setInfoFetched] = useState<boolean>(false);

	const [ownership, setOwnership] = useState<boolean>(false);

	const [isDeletePopupVisible, showDeletePopup] = useState<boolean>(false);

	useEffect(() => {
		axios.get(`/recipe/${id}`)
		.then((response: any) => {
			setRecipeInfo(response.data.recipe_info);

			setOwnership(response.data.ownership);

			setInfoFetched(true);
		})
		.catch((error: any) => {
			console.error(error);
		})
	}, [])

	async function deleteRecipe(event: any) {
		event.preventDefault();

		try {
			const delete_response = await axios.delete(`/recipe/${id}`, {
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					user_id: window.localStorage.getItem("id")
				}
			});

			if (delete_response.data.success) {
				navigate('/');
			} else {
				navigate(`/recipe/${id}`);
			}
		} catch (error: any) {
			console.error(error);
		}
	}

	if (infoFetched) {
		const { name, description, ingredients } = recipe_info;

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
					<div className="delete_popup_overlay" onClick={(event) => {if (event.target.classList.contains("delete_popup_overlay")) showDeletePopup(false) }}>
						<div className="delete_popup_container">
							<h1>Are you sure?</h1>
							<div className="selection_container">
								<button type="button" onClick={deleteRecipe}>Yes</button>
								<button type="button" onClick={() => {showDeletePopup(false)}}>No</button>
							</div>
						</div>
					</div>
				}
				<section id="recipe">
					<div className="recipe_wrapper">
						<div className="main_info">
							<div className="name"><h1>{name}</h1></div>
							<div className="ingredients">{matching_ingredients_HTML}{non_matching_ingredients_HTML}</div>
						</div>
						{ ownership && 
							<div className="delete">
								<button type="button" onClick={() => {showDeletePopup(true)}}><img src={delete_icon} /></button>
							</div>
						}
					</div>
					<hr />
					<div className="description">
						<p>{description ? description : "no description"}</p>
					</div>
				</section>
			</>
		)
	}
}

export default RecipePage;