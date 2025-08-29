import { useEffect, useState } from "react";
import { getRecipeList } from "../service/recipeApi";
import { Link } from "react-router-dom";
import RecipeList from "../components/RecipeList";

export default () => {
    const {recipeList} = RecipeList();

    return (
        <table>
            <tbody>
                {
                    !recipeList && (
                        <tr>
                            <td cocolSpan={3}> 데이터 로딩 중입니다. </td>
                        </tr>
                    )
                }
                {
                    recipeList && recipeList.map((item) => (
                        <tr key={item.recipe_id}>
                            <Link to="/recipeDetail">
                                <td>{item.recipe_nm_ko}</td>
                                <td>{item.sumry}</td>
                                <td>
                                    {
                                        [
                                            ...Array(
                                                item.level_nm === "초보환영" ? 1 :
                                                item.level_nm === "보통" ? 2 :
                                                item.level_nm === "어려움" ? 3 : 0
                                            )
                                        ].map((_, i) => (
                                        <img KEY={i} src="/img/main_icon_1.png" alt="recipe_level"/>
                                        ))
                                    }
                                    {item.level_nm}
                                </td>
                            </Link>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};