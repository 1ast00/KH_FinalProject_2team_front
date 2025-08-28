export default (item) => {
    return(
        <div>
            <p>제조원: {item?.item?.manufacture ?? "-"}</p>
        </div>
    );}