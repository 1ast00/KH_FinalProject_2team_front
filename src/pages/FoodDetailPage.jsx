import { useLocation, useNavigate} from "react-router-dom";
import FoodImgTitle from "../components/food/FoodImgTitle";
import FoodCalories from "../components/food/FoodCalories";
import FoodThreeMajorNutrientsTable from "../components/food/FoodThreeMajorNutrientsTable";
import Foodallergy from "../components/food/FoodAllergy";
import FoodProductGb from "../components/food/FoodProductGb";
import FoodServing from "../components/food/FoodServing";
import FoodManufacture from "../components/food/FoodManufacture";
import FoodDetailTable from "../components/food/FoodDetailTable";
import FoodRawMtrl from "../components/food/FoodRawMtrl";
import FoodCalories2 from "../components/food/FoodCalories2";
import FoodThreeMajorNutrientsTable2 from "../components/food/FoodThreeMajorNutrientsTable2";
import FoodDetailTable2 from "../components/food/FoodDetailTable2";
import { useState } from "react";

export default () => {

    const [query,setQuery] = useState("");

    const navigate = useNavigate();

    const handleSearch = () => {
        if(!query) return;
        navigate("/food/search",{
            state: {
                searchTxtSentInDetailPage: query
            }
        });
    }

    //useLocation()
    //1. FoodSearch에서 { property: "value"}형태로 보내주기
    //2. FoodDetail.jsx에서 const {property} = useLocation();으로 받기
    const {state} = useLocation();
    console.log(state);

    //nutrient String을 정규식을 이용해 parsing하는 함수 1
    const parseFoodData = (nutrientStr) => {
        const result = {
            serving: null,      // 1회 제공량
            totalServing: null, // 총 제공량
            calories: null,     // 열량
            nutrients: {}       // 영양성분
        };

        if (!nutrientStr) return result;

        //열량
        const caloriesMatch = nutrientStr.match(/열량\s*([0-9.]+)kcal/);
        if (caloriesMatch) {
            result.calories = parseFloat(caloriesMatch[1]);
        } 

        // 1회 제공량과 총 제공량
        const servingMatch = nutrientStr.match(/1회 제공량\(([\d.]+)g\)\/총\d+회 제공량\(([\d.]+)g\)/);
        if (servingMatch) {
            result.serving = parseFloat(servingMatch[1]);
            result.totalServing = parseFloat(servingMatch[2]);
        }

        // 영양성분 추출
        const parts = nutrientStr.split(/[,]/);
        parts.forEach(part => {
            const match = part.match(/(\S+)\s*([0-9.]+)\s*(g|mg|kcal)?/);
            if (match) {
                const [_, key, value, unit] = match;
                result.nutrients[key] = { value: parseFloat(value), unit };
            }
        });

        return result;
    }

    //nutrient String을 정규식을 이용해 parsing하는 함수 2
    const parseFoodData2 = (nutrientStr) => {
        const result = {
            serving: null,
            totalServing: null,
            nutrients: {}
        };

        // 1회 제공량 / 총 제공량 추출
        const servingMatch = nutrientStr.match(/1회 제공량.*?\(([\d.]+)g\).*?총.*?회 제공량.*?\(([\d.]+)g\)/);
        if (servingMatch) {
            result.serving = parseFloat(servingMatch[1]);
            result.totalServing = parseFloat(servingMatch[2]);
        }

        // 영양소 추출
        const nutrientNames = "열량|탄수화물|단백질|지방|포화지방|트랜스지방|콜레스테롤|나트륨|식이섬유|당류|비타민A|비타민C|칼슘|철";
        const regex = new RegExp(`(${nutrientNames})\\s*([0-9.]+)\\s*(kcal|g|mg|㎍RE|%)?`, "g");

        let match;
        while ((match = regex.exec(nutrientStr)) !== null) {
            const key = match[1];
            const value = parseFloat(match[2]);
            result.nutrients[key] = value;
        }

        return result;
    };

    //nutrient String을 정규식을 이용해 parsing하는 함수 3
    const parseFoodData3 = (nutrientStr) => {
        const result = {
        serving: null,  // 1회 제공량
        calories: null,         // 1회 제공 열량
        nutrients: {}       // 성분별 { value, unit }
        };

        if (!nutrientStr) return result;

        // 1. 줄바꿈 제거
        const cleaned = nutrientStr.replace(/\n/g, " ");

        // 2. 1회 제공량 추출 (예: 총 내용량 120g 1회(30g)당)
        const servingMatch = cleaned.match(/1회\(([\d.]+)(g|ml)\)/);
        if (servingMatch) {
            result.serving = parseFloat(servingMatch[1]);
        }

        // 3. kcal 추출 (예: 170kcal)
        const kcalMatch = cleaned.match(/(\d+)\s*kcal/);
        if (kcalMatch) {
            result.calories = parseInt(kcalMatch[1], 10);
        }

        // 4. 영양성분 추출 (예: 나트륨160mg, 단백질2g 등)
        const nutrientRegex = /([가-힣]+)\s*([\d.]+)(g|mg|kcal)(?:미만)?/g;
        let match;
        while ((match = nutrientRegex.exec(cleaned)) !== null) {
            const key = match[1];
            const value = parseFloat(match[2]);
            const unit = match[3];
            result.nutrients[key] = { value, unit };
        }

        return result;
    }

    //Zustand로 관리
    // const goBack = () => {
    //     navigate(-1);
    // }

    //api에서 제공하는 nutrients String 형식이 다르므로 다른 함수들로 parsing함.
    //3개의 정규식으로 대부분의 nutrient 정보를 parsing
    const nutrientObj = state?.item? parseFoodData(state.item.nutrient) : null;
    const nutrientObj2 = state?.item? parseFoodData2(state.item.nutrient) : null;
    const nutrientObj3 = state?.item? parseFoodData3(state.item.nutrient) : null;

    return(
        <div>
            {/* Zustand로 관리
            <div>
                <button onClick={goBack}>뒤로 가기</button>
            </div> */}
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
            {!!nutrientObj?.nutrients?.단백질 && !!nutrientObj?.nutrients?.지방 ? (

                <div>
                    <FoodImgTitle item={state.item}/>
                    <FoodCalories nutrientObj={nutrientObj}/>
                    <FoodThreeMajorNutrientsTable nutrientObj={nutrientObj}/>
                    <Foodallergy item={state.item}/>
                    <FoodProductGb item={state.item}/>
                    <FoodServing nutrientObj={nutrientObj}/>
                    <FoodManufacture item={state.item}/>
                    <FoodDetailTable nutrientObj={nutrientObj} nutrientObj2={nutrientObj2} item={state.item}/>
                    <FoodRawMtrl item={state.item}/>
                </div>
            ):(
                <div>
                    {!!nutrientObj2?.nutrients?.열량 ? (<div>
                        <FoodImgTitle item={state.item}/>
                        <FoodCalories2 nutrientObj={nutrientObj2}/>
                        <FoodThreeMajorNutrientsTable2 nutrientObj={nutrientObj2}/>
                        <Foodallergy item={state.item}/>
                        <FoodProductGb item={state.item}/>
                        <FoodServing nutrientObj={nutrientObj2}/>
                        <FoodManufacture item={state.item}/>
                        <FoodDetailTable2 nutrientObj={nutrientObj2} />
                        <FoodRawMtrl item={state.item}/>
                    </div>): (<div>
                        <FoodImgTitle item={state.item}/>
                        <FoodCalories nutrientObj={nutrientObj3}/>
                        <FoodThreeMajorNutrientsTable nutrientObj={nutrientObj3}/>
                        <Foodallergy item={state.item}/>
                        <FoodProductGb item={state.item}/>
                        <FoodServing nutrientObj={nutrientObj3}/>
                        <FoodManufacture item={state.item}/>
                        <FoodDetailTable nutrientObj={nutrientObj3} />
                        <FoodRawMtrl item={state.item}/>
                    </div>)}
                </div>) 
            }
            <div>
                {/* input + button, input값을 상태값으로 관리하고 FoodSearch에 넘겨주기 */}
                <input type="text" 
                placeholder="원하시는 식품을 입력하세요." 
                value={query} 
                onChange={e=>{setQuery(e.target.value)}}/>
                <button onClick={handleSearch}>검색</button>
            </div>
        </div>
    );
}