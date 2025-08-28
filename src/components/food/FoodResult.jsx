import { useNavigate } from "react-router-dom";

export default ({item, parseNutrients}) => {
    const navigate = useNavigate(); 
    const nutrientObj = parseNutrients(item.nutrient);

        return(
                            
            <div key={item.prdlstReportNo}>
                <ul>
                    <li><img src={item.imgurl2} style={{ cursor: "pointer" }} onClick={() => navigate(`/food/search/detail/${item.prdlstNm}`,{ state: {item}})}/></li>
                    <li>{item.prdlstNm}</li>
                    {!!nutrientObj.열량 && (
                        <li>열량: {nutrientObj.열량.value} {nutrientObj.열량.unit}</li>
                    )}
                    {!!nutrientObj.단백질 && (
                        <li>단백질: {nutrientObj.단백질.value} {nutrientObj.단백질.unit}</li>
                    )}
                    {!!nutrientObj.탄수화물 && (
                        <li>탄수화물: {nutrientObj.탄수화물.value} {nutrientObj.탄수화물.unit}</li>
                    )}
                    {!!nutrientObj.지방 && (
                        <li>지방: {nutrientObj.지방.value} {nutrientObj.지방.unit}</li>
                    )}
                </ul>
            </div>
        )
}
