import { useEffect, useState } from "react";
import { getSearchResult } from "../../service/authApi";
import FoodResult from "./FoodResult";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";
import ManufacturerCarousel from "./ManufacturerCarousel";

//검색바와 결과를 출력하는 component
//후에 검색바와 결과를 분리할 예정
export default ({searchTxtSentInFoodDetailPage}) => {

    //input에 입력하는 값을 상태값으로 관리할 변수를 하나 만듬: query
    const [query,setQuery] = useState("");
    
    //query를 상태값으로 저장할 변수를 하나 만듬: searchTxt
    //query를 useEffect에 사용시 매번 요청을 하여 시스템 성능저하와 호출량 제한에 걸릴 수 있음
    const [searchTxt, setSearchTxt] = useState("");
    
    //searchTxt의 결과값을 상태값으로 저장할 변수를 하나 만듬: foodData
    const [foodData, setFoodData] = useState([]);
    
    //Pagination
    const [currentPage,setCurrentPage] = useState(1);
    const PAGE_SIZE =5;
    const [searchPerformed,setSearchPerformed] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {

        console.log("searchTxt: ",searchTxt);
        console.log("searchTxtSentInFoodDetailPage: ",searchTxtSentInFoodDetailPage)
    
        if((!searchTxt || searchTxt.trim() === "") && 
        (!searchTxtSentInFoodDetailPage || searchTxtSentInFoodDetailPage.trim() === "")) 
        return;
    
            {/* 2. searchTxt값을 api를 받는 controller에 연결해서 넘겨줌*/}
            {/*closure: 바깥에 있는 변수를 참조*/}
            const fetchApiData = async() => {

            if(!!searchTxtSentInFoodDetailPage){
                const responseData = await getSearchResult(searchTxtSentInFoodDetailPage, currentPage);
                navigate("/food/search", { replace: true, state: { searchTxtSentInDetailPage: "" } });
                setFoodData(responseData);
            } else {
                const responseData2 = await getSearchResult(searchTxt, currentPage);
                setFoodData(responseData2);
            }
            {/* 3. response값을 foodData에 넣어줌*/}

            }

            fetchApiData(searchTxt); 
            
        },[searchTxt, currentPage])

    const handleSearch = () => {
        {/* 1. query값을 searchTxt state값에 저장*/}
        //비동기적으로 예약되기에 다음 렌더링 사이클에 도달해서야 searchTxt가 바뀜
        //따라서 렌더링 후 실행되는 useEffect를 이용해 다시금 렌더링 해보는 방법을 고안
        setSearchTxt(query);
        setCurrentPage(1);
        setSearchPerformed(true);
        
    }

    //영양성분 nutrient의 string으로 부터 영양성분을 추출하는 함수
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

    //영양성분 nutrient의 string으로 부터 영양성분을 추출하는 함수2
    const parseNutrients2 = (nutrientStr) => {
        const nutrients = {}
        if (!nutrientStr) return nutrients;

        //정규식
        const regex = /([가-힣]+)([\d.]+)([a-zA-Z]*)/g;
        let match;

        while((match = regex.exec(nutrientStr)) !== null){
            const key = match[1];
            const value = parseFloat(match[2]);
            const unit = match[3] || null;
            nutrients[key] ={value,unit};
        }
        return nutrients;
    }

    return(
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
            { !!foodData && foodData?.data?.map((item,index) => {
                console.log("item: ",item);
                    return(
                        <div key={item.prdlstReportNo}>
                            <div>
                                {/* 추천식품 Carousel*/}
                                <ManufacturerCarousel item={item}/>
                            </div>
                        </div>
                    )
                })
            }
            <div>
                <input type="text" 
                placeholder="원하시는 식품을 입력하세요." 
                value={query} 
                onChange={e=>{setQuery(e.target.value)}}/>
                <button onClick={handleSearch}>검색</button>
            </div>
            <div>
            {/* 검색 결과 출력 */}
            { !foodData && <p>검색 결과가 없습니다.</p>}
            { !!foodData && foodData?.data?.map((item,index) => {
                    return(
                        <div key={item.prdlstReportNo}>
                            <div>
                                <FoodResult item={item} parseNutrients={parseNutrients} parseNutrients2={parseNutrients2}/>
                            </div>
                        </div>
                    )
                })
                }
                <div>
                    {/* 페이지 이동 바 */}
                    <Pagination
                        currentPage={currentPage}
                        dataLength={foodData?.data?.length}
                        pageSize={PAGE_SIZE}
                        onPageChange={setCurrentPage}
                        searchPerformed={searchPerformed}
                        totalCount={foodData?.data?.[0]?.totalCount}
                    />
                </div>
            { !!foodData && foodData?.data?.length && (
                <div>
                    <p>{"*"}한국식품안전관리인증원(HACCP)에 등록되어 있지 않은 경우 결과에 나타나지 않을수도 있습니다.</p>
                </div>
            )}
            </div>
            <div>
                {/* Sponsor Image*/}
            </div>
        </div>
    );
}