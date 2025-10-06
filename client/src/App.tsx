import { useState, useEffect } from 'react'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import axios from './api/axios.ts'

if (import.meta.env.PROD) {
	disableReactDevTools();
}

function App() {
	const [recipes, setRecipes] = useState<any>();

	useEffect(() => {
		axios.get(`/recipes`)
		.then((response: any) => {
			setRecipes(response.data.recipes);
			console.log(response.data.recipes)
		})
		.catch((error: any) => {
			console.error(error);
		});
	}, [])

	return(
		<>
			{recipes && recipes.map((recipe) => <p>{recipe.ingredients}</p>)}
		</>
	)
}

export default App
