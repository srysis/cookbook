import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Recipe from "../components/home/Recipe"

import "../style/home.css"

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

	return(
		<section id="home">
			{recipes && recipes.map((recipe) => <Recipe key={recipe.id} content={recipe} />)}
		</section>
	)
}

export default Home;