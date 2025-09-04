export default (nutrientObj) => {

    return(
        <div>
            <p>1회 제공량: {nutrientObj?.nutrientObj?.serving ?? "-"} g</p>
        </div>
    );
}