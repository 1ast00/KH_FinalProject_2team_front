import { useNavigate } from "react-router-dom";
import styles from "../../css/FoodResult.module.css"

export default ({item, parseNutrients, parseNutrients2}) => {

    // console.log("item in FoodResult.jsx: ",item);
    const navigate = useNavigate(); 

    let nutrientObj = null;
    let nutrientObj2= null;

    if(item.nutrient !== "알 수 없음"){
    nutrientObj = parseNutrients(item.nutrient);
    nutrientObj2 = parseNutrients2(item.nutrient);
    } 

    // console.log("nutrientObj: ",nutrientObj);
    // console.log("nutrientObj2: ",nutrientObj2);

        return(               
            <div key={item.prdlstReportNo} className={styles.result_item}>
                <img
                    src={item.imgurl2}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/food/search/detail/${item.prdlstNm}`, { state: { item } })}
                />
                <div className={styles.nutrient_container}>
                    <div className={styles.nameAndCalories}>
                        <h3>{item.prdlstNm}</h3>
                        <p>
                        열량: {nutrientObj?.열량?.value ?? nutrientObj2?.열량?.value ?? "-"}{" "}
                        {nutrientObj?.열량?.unit ?? nutrientObj2?.열량?.unit ?? ""}
                        </p>
                    </div>
                    <hr/>
                    <div className={styles.threeNutrients}>
                        <p>
                        단백질: {nutrientObj?.단백질?.value ?? nutrientObj2?.단백질?.value ?? "-"}{" "}
                        {nutrientObj?.단백질?.unit ?? nutrientObj2?.단백질?.unit ?? ""}
                        </p>
                        <p>
                        탄수화물: {nutrientObj?.탄수화물?.value ?? nutrientObj2?.탄수화물?.value ?? "-"}{" "}
                        {nutrientObj?.탄수화물?.unit ?? nutrientObj2?.탄수화물?.unit ?? ""}
                        </p>
                        <p>
                        지방: {nutrientObj?.지방?.value ?? nutrientObj2?.지방?.value ?? "-"}{" "}
                        {nutrientObj?.지방?.unit ?? nutrientObj2?.지방?.unit ?? ""}
                        </p>
                    </div>
                </div>
            </div>
        )
}
