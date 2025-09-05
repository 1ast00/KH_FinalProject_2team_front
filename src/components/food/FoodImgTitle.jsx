import styles from "../../css/FoodImgTitle.module.css"

export default (item) => {

    return(
        <div className={styles.container}>
            <p><img src={item.item.imgurl1}/></p>
            <p><img src={item.item.imgurl2}/></p>
            <h3>{item.item.prdlstNm}</h3>
        </div>
    );
}