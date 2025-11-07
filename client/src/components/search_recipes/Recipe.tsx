import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"

interface props {
	recipe: {
		id: number,
		name: string,
		description: string,
		short_description: string,
		ingredients: string
	},
	ingredients_list: string[]
}

function Recipe({recipe, ingredients_list}: props) {
	const { id, name, short_description, ingredients } = recipe;
	const { t } = useTranslation();

	function capitalize(word: string) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	const recipe_ingredients = ingredients.split(",");

	let matching_ingredients: string[] = [];
	let matching_ingredients_HTML: any = [];
	let matching_ingredients_amount: number = 0;

	let non_matching_ingredients_HTML: any = [];

	let isFullMatch = false;

	recipe_ingredients.map((recipe_ingredient, index) => {
		if (ingredients_list.includes(recipe_ingredient.toLowerCase())) {
			matching_ingredients_HTML.push(<span key={index} className="matching_ingredient">{capitalize(recipe_ingredient)}</span>);
			matching_ingredients.push(recipe_ingredient);
			matching_ingredients_amount++;
		}
	});

	recipe_ingredients.map((recipe_ingredient, index) => {
		if (!ingredients_list.includes(recipe_ingredient.toLowerCase())) {
			non_matching_ingredients_HTML.push(<span key={index}>{capitalize(recipe_ingredient)}</span>);
		}
	});

	if (matching_ingredients_amount == recipe_ingredients.length) {
		isFullMatch = true;
	}

	const query: any = new URLSearchParams(Object.assign({}, matching_ingredients) as any);
	const queryString: string = query.toString();

	return(
		<>
			<div className={isFullMatch ? "recipe match" : "recipe"}>
				<div className="link_container">
					<div className="overlay">
						<Link to={`/recipe/${id}?${queryString}`}></Link>
					</div>
					<div className="name"><h2>{name}</h2>{isFullMatch && <span className="hint">{t("matchingRecipeTip")}</span>}</div>
					<div className="ingredients">{matching_ingredients_HTML}{non_matching_ingredients_HTML}</div>
					<div className="short_description">
						<p>{short_description}</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default Recipe;