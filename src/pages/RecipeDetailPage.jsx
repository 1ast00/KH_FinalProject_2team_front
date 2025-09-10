import { useParams } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import styles from "../css/RecipeDetail.module.css";
import { isAuthenticated } from "../util/authUtil";
import { naverSearch } from "../service/recipeApi";
import { useEffect, useState } from "react";

export default () => {
    const {id} = useParams();
    const {recipeList} = isAuthenticated() ? RecipeList() : { recipeList: [] };
    const recipe = recipeList.find((item) => String(item.recipe_id) === id);
    const [naverResult, setNaverResult] = useState(null);

    useEffect(() => {
        const fetchNaverSearch = async () => {
            if (recipe) {
                const search = recipe.recipe_nm_ko + " 레시피";
                const response = await naverSearch(search);
                setNaverResult(response);
            }
        }
        fetchNaverSearch();
    }, [recipe]);

    if (!recipe) {
        return (
            <div className={styles.container}>
                <p className={styles.notFound}>레시피를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.imageWrapper}>
                <img src="/img/recipe.png" alt="recipe Detail page img"/>
            </div>
            <div className={styles.container}>
                <div className={styles.recipeCard}>
                    <h2 className={styles.recipeTitle}>
                        {recipe.recipe_nm_ko}
                    </h2>
                    
                    <div className={styles.levelRow}>
                        <div className={styles.recipeLevel}>
                            <span className={`${styles.levelText} ${
                                recipe.level_nm === "초보환영" ? styles.beginner :
                                recipe.level_nm === "보통" ? styles.normal :
                                recipe.level_nm === "어려움" ? styles.hard : ""
                            }`}>
                                {recipe.level_nm}
                            </span>
                        </div>
                    </div>
                    
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>음식 분류:</span>
                        <span className={styles.detailValue}>{recipe.nation_nm}</span>
                    </div>
                    
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>유형 분류:</span>
                        <span className={styles.detailValue}>{recipe.ty_nm}</span>
                    </div>
                    
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>조리 시간:</span>
                        <span className={styles.detailValue}>{recipe.cooking_time}</span>
                    </div>
                    
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>분량:</span>
                        <span className={styles.detailValue}>{recipe.qnt}</span>
                    </div>
                    
                    {recipe.sumry && (
                        <div className={styles.summary}>
                            {recipe.sumry}
                        </div>
                    )}
                </div>

                {/* 네이버 검색 결과 */}
                {naverResult && (
                <div className={styles.naverResult}>
                    <h3>관련 자료</h3>
                    {naverResult.items.map((item, index) => (
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <div key={index} className={styles.resultItem}>
                                <h4 dangerouslySetInnerHTML={{ __html: item.title }} />
                                <p dangerouslySetInnerHTML={{ __html: item.link }} ></p>
                                <p dangerouslySetInnerHTML={{ __html: item.description }} />
                            </div>
                        </a>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};