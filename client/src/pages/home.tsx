import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Recipe from "../components/home/Recipe"

function Home() {
	const [recipes, setRecipes] = useState<any>();

	useEffect(() => {
		axios.get(`/recipes`)
		.then((response: any) => {
			setRecipes(response.data.recipes);
		})
		.catch((error: any) => {
			console.error(error);
		});
	}, []);

	if (recipes != undefined) {
		return(
			<section id="home">
				<p>text</p>
				{recipes.map((recipe) => <Recipe key={recipe.id} content={recipe} />)}
			</section>
		)
	}
}

export default Home;