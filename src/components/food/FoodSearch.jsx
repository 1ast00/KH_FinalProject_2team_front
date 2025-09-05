//Slider: carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { useEffect, useState } from "react";
import { getSearchResult } from "../../service/authApi";
import FoodResult from "./FoodResult";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";
import ManufacturerCarousel from "./ManufacturerCarousel";
import styles from "../../css/FoodSearch.module.css"

//검색바와 결과를 출력하는 component
//후에 검색바와 결과를 분리할 예정
export default ({searchTxtSentInFoodDetailPage}) => {

    //slick settings
    const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false
    };

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

    //Manufacturer(img click)
    const [manufacturer,setManufacturer] = useState("영주한우");

    const navigate = useNavigate();
    
    useEffect(() => {

        // console.log("searchTxt: ",searchTxt);
        // console.log("searchTxtSentInFoodDetailPage: ",searchTxtSentInFoodDetailPage)
    
        if((!searchTxt || searchTxt.trim() === "") && 
        (!searchTxtSentInFoodDetailPage || searchTxtSentInFoodDetailPage.trim() === "")) 
        return;
    
            {/* 2. searchTxt값을 api를 받는 controller에 연결해서 넘겨줌*/}
            {/*closure: 바깥에 있는 변수를 참조*/}
            const fetchApiData = async() => {

            {/* 3. response값을 foodData에 넣어줌*/}    
            if(!!searchTxtSentInFoodDetailPage){
                const responseData = await getSearchResult(searchTxtSentInFoodDetailPage, currentPage);
                navigate("/food/search", { replace: true, state: { searchTxtSentInDetailPage: "" } });
                setFoodData(responseData);
            } else {
                const responseData2 = await getSearchResult(searchTxt, currentPage);
                setFoodData(responseData2);
            }

            }

            fetchApiData(); 

        },[searchTxt,searchTxtSentInFoodDetailPage, currentPage,ManufacturerCarousel])

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

    const handleClick = (productFrom) => {
        setManufacturer(productFrom);
    }

    console.log(manufacturer);

    return(
        <div className={styles.search_container}>
            <div className={styles.manufacturer_carousel}>
                <ManufacturerCarousel 
                searchTxt={searchTxt} 
                searchTxtSentInFoodDetailPage={searchTxtSentInFoodDetailPage}
                currentPage={currentPage}
                manufacturer={manufacturer}/>
            </div>

            <div className={styles.search_bar}>
                <input type="text" 
                placeholder="원하시는 식품을 입력하세요." 
                value={query} 
                onChange={e=>{setQuery(e.target.value)}}/>
                <button onClick={handleSearch}><img src="/img/search_icon.png" alt="search_icon"/></button>
            </div>
            <div className={styles.result}>
            {/* 검색 결과 출력 */}
            { !foodData && <p>검색 결과가 없습니다.</p>}
            { !!foodData && foodData?.data?.map((item,index) => {
                    return(
                        <div key={item.prdlstReportNo} className={styles.result_list}>
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
                <div className={styles.caution}>
                    <p>{"*"} 한국식품안전관리인증원(HACCP)에 등록되어 있지 않은 경우 결과에 나타나지 않을수도 있습니다.</p>
                </div>
            )}
            </div>
            <div className={styles.sponsors}>
                <div>
                    <h3>Sponsors</h3>
                </div>
                <hr/>
                {/* Sponsor Image*/}
                <div className="slider-container">
                    <Slider {...settings}>
                    <div>
                        <img src="/img/food_manufacturer/dongone.jpg" style={{ cursor: "pointer" }} onClick={() => handleClick("㈜동원F&B/서울시 서초구 마방로 68(www.dongwonfnb.co.kr)")} alt="manufacturer_img1"/>
                    </div>
                    <div>
                        <img src="/img/food_manufacturer/foodone.png" style={{ cursor: "pointer" }} onClick={() => handleClick("(유)푸드원 전라남도 고흥군 동강면 청정식품단지길63")} alt="manufacturer_img2"/>
                    </div>
                    <div>
                        <img src="/img/food_manufacturer/hangbokdamgi.png" style={{ cursor: "pointer" }} onClick={() => handleClick("행복담기㈜ 충북 옥천군 옥천읍 중앙로 153")} alt="manufacturer_img3"/>
                    </div>
                    <div>
                        <img src="/img/food_manufacturer/hansung.png" style={{ cursor: "pointer" }} onClick={() => handleClick("한성기업㈜/경남 김해시 삼안로 51")} alt="manufacturer_img4"/>
                    </div>
                    <div>
                        <img src="/img/food_manufacturer/prom.jpg" style={{ cursor: "pointer" }} onClick={() => handleClick("㈜프로엠_경기도 광주시 초월읍 동막골길 140-28")} alt="manufacturer_img5"/>
                    </div>
                    <div>
                        <img src="/img/food_manufacturer/pulmuone.png" style={{ cursor: "pointer" }} onClick={() => handleClick("풀무원건강생활㈜ 충북 증평군 도안면 원명로35")} alt="manufacturer_img6"/>
                    </div>
                    <div>
                        <img src="/img/food_manufacturer/ourHome.png" style={{ cursor: "pointer" }} onClick={() => handleClick("㈜아워홈/경기도 안산시 단원구 원시로 216")} alt="manufacturer_img7"/>
                    </div>
                    <div>
                        <img src="/img/food_manufacturer/yeongjuHanwoo.jpg" style={{ cursor: "pointer" }} onClick={() => handleClick("영주한우")} alt="manufacturer_img8"/>
                    </div>
                    </Slider>
                </div>
            </div>
        </div>
    );
}