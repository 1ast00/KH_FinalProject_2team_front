export default (nutrientObj) => {

    // console.log(nutrientObj);

    return(
        <div>
            <p>칼로리: {nutrientObj?.nutrientObj?.calories ?? "-"} kcal</p>
        </div>
    );
}