import styles from "../../css/FoodManufacture.module.css"

export default (item) => {
    return(
        <div>
            <p className={styles.fontSize}>제조원: {item?.item?.manufacture ?? "-"}</p>
        </div>
    );}