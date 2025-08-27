import { useEffect, useState } from "react";
import { getSearchResult } from "../service/authApi";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

export default () => {

    //input에 입력하는 값을 상태값으로 관리할 변수를 하나 만듬: query
    const [query,setQuery] = useState("");

    //query를 상태값으로 저장할 변수를 하나 만듬: searchTxt
    //query를 useEffect에 사용시 매번 요청을 하여 시스템 성능저하와 호출량 제한에 걸릴 수 있음
    const [searchTxt, setSearchTxt] = useState("");

    //searchTxt의 결과값을 상태값으로 저장할 변수를 하나 만듬: foodData
    const [foodData, setFoodData] = useState([]);

    //useNavigate: Page navigation
    const navigate = useNavigate();

    //Pagination
    const [currentPage,setCurrentPage] = useState(1);
    const PAGE_SIZE =5;
    const [searchPerformed,setSearchPerformed] = useState(false);

    useEffect(() => {

        if(!searchTxt) return;

        console.log("useEffect로 다시 렌더링한 searchTxt: "+ searchTxt);

        {/* 2. searchTxt값을 api를 받는 controller에 연결해서 넘겨줌*/}
        {/*closure: 바깥에 있는 변수를 참조*/}
        const fetchApiData = async() => {
        const responseData = await getSearchResult(searchTxt, currentPage);

        {/* 3. response값을 foodData에 넣어줌*/}
        setFoodData(responseData);
        // {/* foodData를 확인하는 콘솔창: 의미없음. 다음 렌더링 사이클이 되어야만 업데이트 됨. setState는 비동기임*/}
        // console.log("foodData in FoodSearch.jsx: ",foodData);
        // console.log("foodData:", foodData);
        // /*Optional Chaining: returns the undefined if the data does not exist*/
        // console.log("foodData?.data?.[0]: ",foodData?.data?.[0]);
        }

        fetchApiData(searchTxt);
        
    },[searchTxt, currentPage])


    const handleSearch = () => {
        {/* 1. query값을 searchTxt state값에 저장*/}
        //비동기적으로 예약되기에 다음 렌더링 사이클에 도달해서야 searchTxt가 바뀜
        //따라서 렌더링 후 실행되는 useEffect를 이용해 다시금 렌더링 해보는 방법을 고안
        setSearchTxt(query);
        console.log("handleSearch()안 searchTxt: "+ searchTxt);

        setCurrentPage(1);
        setSearchPerformed(true);
    }

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

    return (
        <div>
            {/* <img src=""/> */}

            <input type="text" 
            placeholder="원하시는 식품을 입력하세요." 
            value={query} 
            onChange={e=>{setQuery(e.target.value)}}/>
            <button onClick={handleSearch}>검색</button>

            <div>
                {/*검색 결과 출력*/}
                { !foodData && <p>검색 결과가 없습니다.</p>}
                { !!foodData && foodData?.data?.map((item,index) => {

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
                    })
                }
                                <Pagination
                                    currentPage={currentPage}
                                    dataLength={foodData?.data?.length}
                                    pageSize={PAGE_SIZE}
                                    onPageChange={setCurrentPage}
                                    searchPerformed={searchPerformed}
                                />
            </div>
        </div>
    );
}
