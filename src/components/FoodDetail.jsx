import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default () => {

    //useLocation Hook
    const location = useLocation();
    const foodItem = location.state.item;

    //useState Hook
    const [foodDetailedData,setFoodDetailedData] = useState([]);

    useEffect(() => {
        //1번만 렌더링: dependency function은 비워둠
            setFoodDetailedData(foodItem);
    },[])

    const parseNutrients = (nutrientStr) => {
        const nutrients = {}
        if (!nutrientStr) return nutrients;

        //정규식
        const regex = /[\s,]*(\S+?)\s([\d.]+)(g|mg|kcal)/g;
        let match;

        while((match = regex.exec(nutrientStr)) !== null){
            const key = match[1];
            const value = parseFloat(match[2]);
            const unit = match[3];
            nutrients[key] ={value,unit};
        }

        return nutrients;
    }

    return(
        <div>
            <p>foodDetail.jsx페이지입니다.</p>
        </div>
    );
}