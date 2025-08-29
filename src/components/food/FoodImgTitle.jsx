export default (item) => {

    return(
        <div>
            <ul>
                <li><img src={item.item.imgurl1}/></li>
                <li><img src={item.item.imgurl2}/></li>
                <li>{item.item.prdlstNm}</li>
            </ul>
        </div>
    );
}