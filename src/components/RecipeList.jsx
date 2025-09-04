import { useEffect, useState } from "react";
import { getRecipeList } from "../service/recipeApi";

export default () => {
    const [recipeList, setRecipeList] = useState([]);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await getRecipeList();
                if(response.msg) return;
                setRecipeList(response.recipeList);
            } catch (error) {
                console.log("RecipePage: " + error);
            }
        };
        fetchRecipe();
    }, []);
    return {recipeList};
};