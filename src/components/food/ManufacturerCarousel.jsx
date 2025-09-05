import { useEffect, useState } from "react";
import { getTotalSearchResult } from "../../service/authApi";
import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/Manufacturer.css"

export default ({searchTxt,searchTxtSentInFoodDetailPage,currentPage,manufacturer}) => {

    console.log("manufacturer in ManufacturerCarousel.jsx:",manufacturer);

    const settings = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,  // 1024px 이하일 때
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        arrows: true
      }
    },
    {
      breakpoint: 768,   // 768px 이하일 때
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: true
      }
    }
  ]
};

    // console.log("searchTxt in Manufacturer Carousel: ",searchTxt);

    const [carouselText,setCarouselText] = useState("");
    const [totalList, setTotalList] = useState([]);
    const navigate= useNavigate();

    useEffect(() => {

        console.log("manufacturer in ManufacturerCarousel.jsx:",manufacturer);

        if(!!searchTxtSentInFoodDetailPage){
            setCarouselText(searchTxtSentInFoodDetailPage);
        } else {
            setCarouselText(searchTxt);
        }

        // if((!searchTxt || searchTxt.trim() === "") && 
        // (!searchTxtSentInFoodDetailPage || searchTxtSentInFoodDetailPage.trim() === "")) 
        //     return;

        fetchApiData();

        console.log("totalList in ManufacturerCarousel.jsx:",totalList);

    },[searchTxt,searchTxtSentInFoodDetailPage,currentPage,manufacturer])

    const fetchApiData = async() => {
        {/* 3. response값을 foodData에 넣어줌*/}    
        if(!!searchTxtSentInFoodDetailPage){
            const responseData = await getTotalSearchResult(searchTxtSentInFoodDetailPage, currentPage);
            navigate("/food/search", { replace: true, state: { searchTxtSentInDetailPage: "" } });
            setTotalList(responseData);
        } else {
            const responseData2 = await getTotalSearchResult(carouselText, currentPage);
            setTotalList(responseData2);
        }
    }

    const handleClick = (item) => {
        navigate(`/food/search/detail/${item.prdlstNm}`,{
                state : {item}
        })
    }

    return(
        <div className="slider-container">
            <Slider {...settings}>
            {(!!totalList ) ? 
            totalList?.data
            ?.filter((item) => item.manufacture === manufacturer)
            .map((item)=>(
                <div key={item.prdlstReportNo}>
                    <h3><img src={item.imgurl1} onClick={() => handleClick(item)}/></h3>
                    {/* <h3>{item.prdlstNm}</h3> */}
                </div> 
            ))
            : (
            <div>
                <h3>해당하는 제품들이 없습니다</h3>
            </div>)}
            </Slider>
        </div>
    );
}
