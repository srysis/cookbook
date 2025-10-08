import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from '../api/axios'

function RecipePage() {
	const { id } = useParams();

	const [recipe_info, setRecipeInfo] = useState<any>();
	const [infoFetched, setInfoFetched] = useState<boolean>(false);

	useEffect(() => {
		axios.get(`/recipe/${id}`)
		.then((response: any) => {
			console.log(response.data);
			setRecipeInfo(response.data.recipe_info);

			setInfoFetched(true);
		})
		.catch((error: any) => {
			console.error(error);
		})
	}, [])

	if (infoFetched) {
		return(
			<section id="recipe">
				<h1>{recipe_info.name}</h1>
				<p>{recipe_info.ingredients}</p>
			</section>
		)
	}
}

export default RecipePage;