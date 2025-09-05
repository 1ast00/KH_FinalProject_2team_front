import { useEffect, useState } from "react";
import { getTotalSearchResult } from "../../service/authApi";
import { useNavigate } from "react-router-dom";

export default ({searchTxt,searchTxtSentInFoodDetailPage,currentPage,manufacturer}) => {

    // console.log("searchTxt in Manufacturer Carousel: ",searchTxt);
    // console.log("manufacturer in Manufacturer Carousel: ",manufacturer);

    const [carouselText,setCarouselText] = useState("닭가슴살");
    const [totalList, setTotalList] = useState([]);
    const navigate= useNavigate();

    useEffect(() => {

        if(!!searchTxtSentInFoodDetailPage){
            setCarouselText(searchTxtSentInFoodDetailPage);
        } else {
            setCarouselText(searchTxt);
        }

        // if((!searchTxt || searchTxt.trim() === "") && 
        // (!searchTxtSentInFoodDetailPage || searchTxtSentInFoodDetailPage.trim() === "")) 
        //     return;

        fetchApiData();

    },[searchTxt,searchTxtSentInFoodDetailPage,currentPage])

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

    console.log("totalList in Manufacturer Carousel: ",totalList);
    // console.log("totalList.data?.[0]?.imgurl1 in Manufacturer Carousel: ",totalList.data?.[0]?.imgurl1);
    // console.log("totalList.data.map((item)=> ()):", totalList?.data?.map((item)=>(
    //             <p>{item.imgurl1}</p>
    //         )))

    return(
        <>
            {(!!totalList ) ? 
            totalList?.data
            ?.filter((item) => item.manufacture === manufacturer)
            .map((item)=>(
                <div key={item.prdlstReportNo}>
                    <div>
                        <ul>
                            <li><img src={item.imgurl1}/></li>
                            <li>{item.prdlstNm}</li>
                        </ul>
                    </div>
                </div> 
            ))
            : <p>해당하는 제품들이 없습니다</p>}
        </>
    );
}
