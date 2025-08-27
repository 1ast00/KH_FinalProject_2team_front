import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default () => {

    //useParams()
    //1. App.js에서 Route의 경로 설정( path = "path/:variable_name")
    //2. FoodSearch에서 ${}형태로 변수값 보내주기 ( navigate("path/${variable_name}"))
    //3. FoodDetail.jsx에서 const {variable_name} = useParams()로 받기
    // const {prdlstNm} = useParams();

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

    //api에서 제공하는 nutrients String 형식이 다르므로 다른 함수들로 parsing함.
    const nutrientObj = state?.item? parseFoodData(state.item.nutrient) : null;
    const nutrientObj2 = state?.item? parseFoodData2(state.item.nutrient) : null;
    console.log("nutrientObj: ",nutrientObj);
    console.log("nutrientObj2:", nutrientObj2);
    console.log("nutrientObj2.nutrients.단백질: ", nutrientObj2.nutrients.단백질)

    return(
        <div>
            {!!nutrientObj?.nutrients?.단백질 && !!nutrientObj?.nutrients?.지방 ? (

                <div>
                    <div>
                        <ul>
                            <li><img src={state.item.imgurl1}/></li>
                            <li><img src={state.item.imgurl2}/></li>
                            <li>{state.item.prdlstNm}</li>
                        </ul>
                    </div>
                    <div>
                        <p>칼로리: {nutrientObj?.calories ?? "-"} kcal</p>
                    </div>
                    <div>
                        <ul>
                            <p>영양성분 표 (1회 제공량 기준)</p>
                            <table>
                                <thead>
                                <tr>
                                    <th>영양성분</th>
                                    <th>함량 (g)</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>단백질</td>
                                    <td>{nutrientObj?.nutrients?.단백질?.value ?? "-"}</td>
                                </tr>
                                <tr>
                                    <td>지방</td>
                                    <td>{nutrientObj?.nutrients?.지방?.value ?? "-"}</td>
                                </tr>
                                <tr>
                                    <td>탄수화물</td>
                                    <td>{nutrientObj?.nutrients?.탄수화물?.value ?? "-"}</td>
                                </tr>
                                </tbody>
                            </table>
                            <p>출처: 한국식품관리인증원</p>
                        </ul>
                    </div>
                    <div>
                        <p>알레르기 유발 물질: {state?.item?.allergy ?? "-"}</p>
                    </div>
                    <div>
                        <p>식품 종류: {state?.item?.productGb ?? "-"}</p>
                    </div>
                    <div>
                        <p>1회 제공량: {nutrientObj?.serving ?? "-"} g</p>
                    </div>
                    <div>
                        <p>제조원: {state?.item?.manufacture ?? "-"}</p>
                    </div>
                    <div>
                        <ul>
                            <p>영양성분 상세 (1회 제공량 기준)</p>
                            <table>
                                <thead>
                                <tr>
                                    <th>영양성분</th>
                                    <th>함량</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>단백질</td>
                                    <td>{nutrientObj?.nutrients?.단백질?.value ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>지방</td>
                                    <td>{nutrientObj?.nutrients?.지방?.value ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>탄수화물</td>
                                    <td>{nutrientObj?.nutrients?.탄수화물?.value ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>당류</td>
                                    <td>{nutrientObj?.nutrients?.당류?.value ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>포화지방</td>
                                    <td>{nutrientObj?.nutrients?.포화지방?.value ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>트랜스지방</td>
                                    <td>{nutrientObj?.nutrients?.트랜스지방?.value ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>콜레스트롤</td>
                                    <td>{nutrientObj?.nutrients?.콜레스테롤?.value ?? "-"} mg</td>
                                </tr>
                                <tr>
                                    <td>나트륨</td>
                                    <td>{nutrientObj?.nutrients?.나트륨?.value ?? "-"} mg</td>
                                </tr>
                                </tbody>
                            </table>
                            <p>출처: 한국식품관리인증원</p>
                        </ul>
                    </div>
                    <div>
                        <p>원재료: {state?.item?.rawmtrl ?? "정보가 없습니다."}</p>
                    </div>
                </div>
            ):(
                <>
                 {!!nutrientObj2?.nutrients?.단백질 && !!nutrientObj2?.nutrients?.지방 ? (

                <div>
                    <div>
                        <ul>
                            <li><img src={state.item.imgurl1}/></li>
                            <li><img src={state.item.imgurl2}/></li>
                            <li>{state.item.prdlstNm}</li>
                        </ul>
                    </div>
                    <div>
                        <p>칼로리: {nutrientObj2?.nutrients?.열량 ?? "-"} kcal</p>
                    </div>
                    <div>
                        <ul>
                            <p>영양성분 표 (1회 제공량 기준)</p>
                            <table>
                                <thead>
                                <tr>
                                    <th>영양성분</th>
                                    <th>함량 (g)</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>단백질</td>
                                    <td>{nutrientObj2?.nutrients?.단백질 ?? "-"}</td>
                                </tr>
                                <tr>
                                    <td>지방</td>
                                    <td>{nutrientObj2?.nutrients?.지방 ?? "-"}</td>
                                </tr>
                                <tr>
                                    <td>탄수화물</td>
                                    <td>{nutrientObj2?.nutrients?.탄수화물 ?? "-"}</td>
                                </tr>
                                </tbody>
                            </table>
                            <p>출처: 한국식품관리인증원</p>
                        </ul>
                    </div>
                    <div>
                        <p>알레르기 유발 물질: {state?.item?.allergy ?? "-"}</p>
                    </div>
                    <div>
                        <p>식품 종류: {state?.item?.productGb ?? "-"}</p>
                    </div>
                    <div>
                        <p>1회 제공량: {nutrientObj2?.serving ?? "-"} g</p>
                    </div>
                    <div>
                        <p>제조원: {state?.item?.manufacture ?? "-"}</p>
                    </div>
                    <div>
                        <ul>
                            <p>영양성분 상세 (1회 제공량 기준)</p>
                            <table>
                                <thead>
                                <tr>
                                    <th>영양성분</th>
                                    <th>함량</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>단백질</td>
                                    <td>{nutrientObj2?.nutrients?.단백질 ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>지방</td>
                                    <td>{nutrientObj2?.nutrients?.지방 ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>탄수화물</td>
                                    <td>{nutrientObj2?.nutrients?.탄수화물 ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>당류</td>
                                    <td>{nutrientObj2?.nutrients?.당류 ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>포화지방</td>
                                    <td>{nutrientObj2?.nutrients?.포화지방 ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>트랜스지방</td>
                                    <td>{nutrientObj2?.nutrients?.트랜스지방 ?? "-"} g</td>
                                </tr>
                                <tr>
                                    <td>콜레스트롤</td>
                                    <td>{nutrientObj2?.nutrients?.콜레스테롤 ?? "-"} mg</td>
                                </tr>
                                <tr>
                                    <td>나트륨</td>
                                    <td>{nutrientObj2?.nutrients?.나트륨 ?? "-"} mg</td>
                                </tr>
                                </tbody>
                            </table>
                            <p>출처: 한국식품관리인증원</p>
                        </ul>
                    </div>
                    <div>
                        <p>원재료: {state?.item?.rawmtrl ?? "정보가 없습니다."}</p>
                    </div>
                </div>) : (
                    <p>해당 제품 정보가 없습니다.</p>
                )}
                </>
            )}
        </div>
    );
}