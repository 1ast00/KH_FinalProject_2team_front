import React, { useState } from "react";
import { postToAI } from "../service/authApi";
import styles from "../css/Gemini.module.css";
import GeminiRequest from "../components/GeminiRequest";   
import GeminiResponse from "../components/GeminiResponse"; 

export default function Gemini() {
  const [prompt, setPrompt] = useState(""); // 사용자 질문 입력을 위한 상태
  const [response, setResponse] = useState(""); // AI 응답을 저장하는 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  // 질문하기 버튼 클릭 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("질문을 입력해주세요!");
      return;
    }
    setIsLoading(true); // 로딩 시작
    setResponse("");

    // AI에게 보낼 프롬프트 생성
    const fullPrompt = `당신은 사용자의 건강과 운동에 대해 조언해주는 'AI 운동 코치'입니다. 다음 질문에 대해 전문가처럼 친절하고 상세하게 답변해주세요:\n\n질문: "${prompt}"`;
    // API 함수 호출해서 AI에게 질문 보내기
    const aiResponse = await postToAI(fullPrompt);

    setResponse(aiResponse);
    setIsLoading(false); // 로딩 종료
  };

  return (
    <div className={styles.container}>
       <img
        src="/img/Gemini.png"
        alt="제미니 AI 코치 배너"
        className={styles.bannerImage} // 배너
      />
      
      <div className={styles.header}>
        <h1>AI 운동 코치에게 물어보세요 💬</h1>
        <p>오늘의 운동 계획, 식단, 건강 상식 등 궁금한 점을 질문해보세요.</p>
      </div>
     
      {/* 변경된 이름의 컴포넌트 사용 */}
      <GeminiRequest
        prompt={prompt}
        setPrompt={setPrompt}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {isLoading && <div className={styles.loading}>답변을 생성하고 있습니다...</div>}

      {/* 변경된 이름의 컴포넌트 사용 */}
      {response && !isLoading && <GeminiResponse response={response} />}
    </div>
  );
}