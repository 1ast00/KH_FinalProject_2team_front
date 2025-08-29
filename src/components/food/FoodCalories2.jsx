export default (nutrientObj2) => {

    return(
        <div>
            <p>칼로리: {nutrientObj2?.nutrientObj?.nutrients?.열량 ?? "-"} kcal</p>
        </div>
    );
}