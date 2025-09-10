import { useLocation } from "react-router-dom";
import FoodSearch from "../components/food/FoodSearch";
import styles from "../css/FoodPage.module.css"
import { useEffect } from "react";
import { useNavStore } from "../store/navStore"; // 경로 맞게 수정

export default () => {

    const location = useLocation();
    // console.log("location object: ",location);

    const push = useNavStore((state) => state.push);

    const searchTxtSentInFoodDetailPage = location?.state?.searchTxtSentInDetailPage || "";
    // console.log("location.state.searchTxtSentInDetailPage: ", location?.state?.searchTxtSentInDetailPage);

    
    useEffect(() => {
        push(location.pathname, location.state || {});

        console.log("location.pathname:",location.pathname);
        console.log("location.state:",location.state);
    }, [location.pathname, location.state]);

    return (
        <div>
            <div className={styles.banner_image}>
                <img src="/img/food_banner.png" />
            </div>
            <div className={styles.food_search}>
                <FoodSearch searchTxtSentInFoodDetailPage={searchTxtSentInFoodDetailPage}/>
            </div>
        </div>
    );
}
