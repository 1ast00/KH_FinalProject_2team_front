import styles from "../../css/FoodThreeMajorNutrientsTable2.module.css"

export default ({nutrientObj}) => {

    return(
        <div>
        <div className={styles.container}>
            <h3>영양성분 상세 (1회 제공량 기준)</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>영양성분</th>
                        <th>함량</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>단백질</td>
                        <td>{nutrientObj?.nutrients?.단백질 ?? "-"} g</td>
                    </tr>
                    <tr>
                        <td>지방</td>
                        <td>{nutrientObj?.nutrients?.지방 ?? "-"} g</td>
                    </tr>
                    <tr>
                        <td>탄수화물</td>
                        <td>{nutrientObj?.nutrients?.탄수화물 ?? "-"} g</td>
                    </tr>
                    <tr>
                        <td>당류</td>
                        <td>{nutrientObj?.nutrients?.당류 ?? "-"} g</td>
                    </tr>
                    <tr>
                        <td>포화지방</td>
                        <td>{nutrientObj?.nutrients?.포화지방 ?? "-"} g</td>
                    </tr>
                    <tr>
                        <td>트랜스지방</td>
                        <td>{nutrientObj?.nutrients?.트랜스지방 ?? "-"} g</td>
                    </tr>
                    <tr>
                        <td>콜레스트롤</td>
                        <td>{nutrientObj?.nutrients?.콜레스테롤 ?? "-"} mg</td>
                    </tr>
                    <tr>
                        <td>나트륨</td>
                        <td>{nutrientObj?.nutrients?.나트륨 ?? "-"} mg</td>
                    </tr>
                </tbody>
            </table>
            <p>출처: 한국식품관리인증원(HACCP)</p>
        </div>
        </div>
    );
}