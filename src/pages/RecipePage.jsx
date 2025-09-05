import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import styles from "../css/Recipe.module.css";

export default () => {
    const {recipeList} = RecipeList();
    const navigate = useNavigate();
    const [searchRecipe, setSearchRecipe] = useState("");
    const [listView, setListView] = useState([]);

    useEffect(() => {
        if(recipeList) {
            const filter = recipeList.filter((item) => 
                item.recipe_nm_ko.toLowerCase().includes(searchRecipe.toLowerCase())
            );
            setListView(filter);
        }
    }, [searchRecipe, recipeList]);

    return (
        <div>
            <div className={styles.imageWrapper}>
                <img src="/img/recipe.png"alt="recipe page img"/>
            </div>

            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="레시피를 검색해 보세요...🥕"
                    value={searchRecipe}
                    onChange={(e) => setSearchRecipe(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.recipeContainer}>
            {
                !recipeList && (
                    <div className={styles.loadingMessage}>
                        데이터 로딩 중입니다.
                    </div>
                )
            }
            {
                listView && listView.map((item) => (
                    <div 
                        key={item.recipe_id}
                        className={styles.recipeCard}
                        onClick={() => navigate(`/recipeDetail/${item.recipe_id}`)}
                    >                            
                        <div className={styles.recipeName}>{item.recipe_nm_ko}</div>
                        <div className={styles.recipeSummary}>{item.sumry}</div>
                        <div className={styles.recipeLevel}>
                            <span className={`${styles.levelText} ${
                                item.level_nm === "초보환영" ? styles.beginner :
                                item.level_nm === "보통" ? styles.normal :
                                item.level_nm === "어려움" ? styles.hard : ""
                            }`}>
                                {item.level_nm}
                            </span>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    );
};