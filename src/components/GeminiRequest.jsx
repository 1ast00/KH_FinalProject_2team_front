import React from "react";
import styles from "../css/Gemini.module.css";

const GeminiRequest = ({ prompt, setPrompt, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="예: 집에서 할 수 있는 10분짜리 유산소 운동 추천해줘"
        className={styles.textarea}
        rows="4"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? "코치가 생각 중..." : "질문하기"}
      </button>
    </form>
  );
};

export default GeminiRequest;