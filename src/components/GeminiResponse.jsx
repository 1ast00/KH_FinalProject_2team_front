import React from "react";
import styles from "../css/Gemini.module.css";
import ReactMarkdown from "react-markdown";

export default ({ response }) => {
  return (
    <div className={styles.responseCard}>
      <h2>맞춤형 다이어트 간단 플랜</h2>
      <br/><br/>
      <div className={styles.markdown}>
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </div>
  );
};
