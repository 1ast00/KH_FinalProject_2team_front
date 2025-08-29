export default (item) => {
    return(
        <div>
            <p>알레르기 유발 물질: {item?.item?.allergy ?? "-"}</p>
        </div>
    );
}