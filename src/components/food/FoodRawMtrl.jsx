export default (item) => {
    return(
        <div>
            <p>원재료: {item?.item?.rawmtrl ?? "정보가 없습니다."}</p>
        </div>
    );
}