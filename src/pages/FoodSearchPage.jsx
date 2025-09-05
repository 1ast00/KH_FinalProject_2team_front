import { useLocation } from "react-router-dom";
import FoodSearch from "../components/food/FoodSearch";
import ManufacturerCarousel from "../components/food/ManufacturerCarousel";

export default () => {

    const location = useLocation();
    // console.log("location object: ",location);

    const searchTxtSentInFoodDetailPage = location?.state?.searchTxtSentInDetailPage || "";
    // console.log("location.state.searchTxtSentInDetailPage: ", location?.state?.searchTxtSentInDetailPage);

    return (
        <div>
            <div style={{
                width: "88%",
                height: "280.72px",
                overflow: "hidden"
            }}>
                <img src="/img/food_banner.jpg" 
                style={{
                    width: "1267.2px"
                }}/>
            </div>
            <FoodSearch searchTxtSentInFoodDetailPage={searchTxtSentInFoodDetailPage}/>
        </div>
    );
}
