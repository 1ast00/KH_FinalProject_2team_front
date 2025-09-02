export default (item) => {
    return(
        <div>
            <p>식품 종류: {item?.item?.productGb ?? "-"}</p>
        </div>
    );
}