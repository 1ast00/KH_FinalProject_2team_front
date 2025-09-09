import styles from "../../css/FoodImgTitle.module.css";

export default (item) => {

    return(
        <div className={styles.wrapper}>
        <div className={styles.container}>
            <img src={item.item.imgurl1}/>
            <img src={item.item.imgurl2}/>
            <h3>{item.item.prdlstNm}</h3>
        </div>
        </div>
    );
}