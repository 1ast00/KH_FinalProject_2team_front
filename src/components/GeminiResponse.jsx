import React from "react";
import styles from "../css/Gemini.module.css";

const GeminiResponse = ({ response }) => {
  return (
    <div className={styles.responseCard}>
      <h2>AI 코치의 답변:</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{response}</p>
    </div>
  );
};

export default GeminiResponse;