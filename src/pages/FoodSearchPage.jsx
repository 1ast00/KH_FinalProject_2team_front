import { useLocation } from "react-router-dom";
import FoodSearch from "../components/food/FoodSearch";
import styles from "../css/FoodPage.module.css"

export default () => {

    const location = useLocation();
    // console.log("location object: ",location);

    const searchTxtSentInFoodDetailPage = location?.state?.searchTxtSentInDetailPage || "";
    // console.log("location.state.searchTxtSentInDetailPage: ", location?.state?.searchTxtSentInDetailPage);

    return (
        <div className="pageContainer">
            <div className={styles.banner_image}>
                <img src="/img/food_banner.png" />
            </div>
            <div className={styles.food_search}>
                <FoodSearch searchTxtSentInFoodDetailPage={searchTxtSentInFoodDetailPage}/>
            </div>
        </div>
    );
}
