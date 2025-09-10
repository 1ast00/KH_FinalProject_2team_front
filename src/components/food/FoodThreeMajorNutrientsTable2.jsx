import styles from "../../css/FoodThreeMajorNutrientsTable2.module.css"

export default (nutrientObj) => {
    return(
        <div>
        <div>
            <h3 className={styles.title}>영양성분 표 (1회 제공량 기준)</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>영양성분</th>
                        <th>함량 (g)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>단백질</td>
                        <td>{nutrientObj?.nutrientObj?.nutrients?.단백질 ?? "-"}</td>
                    </tr>
                    <tr>
                        <td>지방</td>
                        <td>{nutrientObj?.nutrientObj?.nutrients?.지방 ?? "-"}</td>
                    </tr>
                    <tr>
                        <td>탄수화물</td>
                        <td>{nutrientObj?.nutrientObj?.nutrients?.탄수화물 ?? "-"}</td>
                    </tr>
                </tbody>
            </table>
            <p>출처: 한국식품관리인증원(HACCP)</p>
        </div>
        </div>
    );
}