import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../css/FoodAi.module.css";

export default () => {

    const location = useLocation();
    console.log("location in FoodAiPage.jsx: ",location)
    const response = location.state || [];

    console.log("response in FoodAiPage.jsx: ",response);

    return(
        <div className={styles.container}>
            {!response &&
            <div className={styles.noResponse}>
                <p>응답이 오지 않습니다.</p>
            </div>
            }
            {!!response && 
            <div className={styles.markdownWrapper}>
                <h2>AI 식단 관리사의 답변</h2>
                <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                >{response.res}</ReactMarkdown>
            </div>    
        }
        </div>
    )
}