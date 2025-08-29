import { useLocation } from "react-router-dom";
import FoodSearch from "../components/food/FoodSearch";

export default () => {

    const location = useLocation();
    console.log("location object: ",location);

    const searchTxtSentInFoodDetailPage = location?.state?.searchTxtSentInDetailPage || "";
    console.log("location.state.searchTxtSentInDetailPage: ", location?.state?.searchTxtSentInDetailPage);

    return (
        <div>
            {/* <img src=""/> */}
            <FoodSearch searchTxtSentInFoodDetailPage={searchTxtSentInFoodDetailPage}/>
        </div>
    );
}
