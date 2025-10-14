import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Recipe from "../components/home/Recipe"

import "../style/home.css"

type Recipe = {
	id: number,
	name: string,
	description: string,
	ingredients: string
}

function Home() {
	const [recipes, setRecipes] = useState<Array<Recipe>>([]);

	useEffect(() => {
		axios.get(`/recipes`)
		.then((response: any) => {
			setRecipes(response.data.recipes);
		})
		.catch((error: any) => {
			console.error(error);
		});
	}, []);

	return(
		<section id="home">
			{recipes && recipes.map((recipe) => <Recipe key={recipe.id} content={recipe} />)}
		</section>
	)
}

export default Home;