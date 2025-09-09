import React, { useState } from "react";
import { postToAI } from "../service/authApi";
import styles from "../css/Gemini.module.css";
import GeminiRequest from "../components/GeminiRequest";   
import GeminiResponse from "../components/GeminiResponse"; 

export default function Gemini() {
  const [response, setResponse] = useState(""); // AI 응답을 저장하는 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  // 질문하기 버튼 클릭 함수
  const handleSubmit = async (data) => {
    if (!data.height || !data.weight) {
      alert("신장과 현재 체중은 반드시 입력해주세요!");
      return;
    }
    setIsLoading(true); // 로딩 시작
    setResponse("");

    // AI에게 보낼 프롬프트 생성
    let fullPrompt = `당신은 사용자의 정보를 바탕으로 다이어트 플랜을 세워주는 'AI 건강 플래너'입니다.
                    신장: ${data.height}cm, 현재 체중: ${data.weight}kg, 성별: ${data.gender || "미입력"}, 
                    연령대: ${data.ageGroup || "미입력"}, 목표 체중: ${data.goalWeight || "미입력"}kg,
                    목표 기간: ${data.period || "미입력"}, 신체 활동 수준: ${data.activity || "미입력"},
                    식사 습관: ${data.dietPreference || "미입력"}, 알레르기: ${data.allergies || "없음"},
                    기저 질환: ${data.health || "없음"} 위 정보를 바탕으로 간단한 다이어트 플랜을 제시해 주세요.
                    확인용으로 사용자 정보 먼저 제시, 신장과 현재 체중 정보로 BMI 제시, 식단, 운동 제시, 중요 포인트 제시
                    하단엔 AI는 참고용으로만 사용하라고 경고`;

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
        <h1>AI로 다이어트 플랜을 받아보세요 💬</h1>
        <p>신장과 현재 체중만 입력해도 기본 플랜을 받을 수 있어요!</p>
      </div>
     
      <GeminiRequest handleSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && <div className={styles.loading}></div>}

      {/* 변경된 이름의 컴포넌트 사용 */}
      {response && !isLoading && <GeminiResponse response={response} />}
    </div>
  );
}