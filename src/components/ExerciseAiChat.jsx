import React, { useState } from 'react';
import { postToAIForExercise } from '../service/authApi'; // [수정] import 변경
import styles from '../css/ExerciseAiChat.module.css';

// 부모 컴포넌트로부터 exerciseName과 onClose 함수를 props로 받음
export default function ExerciseAiChat({ exerciseName, onClose }) {
  const [prompt, setPrompt] = useState(''); // 사용자 질문 입력을 위한 상태
  const [response, setResponse] = useState(''); // AI 응답을 저장하는 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  // 폼 제출 (질문하기 버튼 클릭) 시 실행될 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작(새로고침) 방지
    if (!prompt.trim()) {
      alert('질문을 입력해주세요!');
      return;
    }
    setIsLoading(true);
    setResponse('');

    // AI에게 컨텍스트(운동명)와 함께 질문을 전달하기 위한 프롬프트 구성
    const fullPrompt = `당신은 사용자의 건강과 운동에 대해 조언해주는 전문 트레이너입니다. 특히 '${exerciseName}' 운동에 대해 아주 잘 알고 있습니다. 
    
      다음 지침을 반드시 따라서 답변해주세요:

      1. 형식 : 마크다운(**, *)없이 깔끔한 특수 기호를 사용하고 텍스트로만 답변해주세요.
      2. 구조 : 답변이 길어질 경우, 사용자가 이해하기 쉽도록 번호나 글머리 기호를 사용해 목록 형태로 설명해주세요.
      3. 어조 : 항상 긍정적이고 격려하는 말투를 사용하세요.
      4. 필수 내용: 운동 자세를 설명할 때는 흔히 저지르는 실수와 부상 방지 팁을 반드시 포함해주세요.
      5. 금지 사항: 절대 "나는 AI 언어 모델이기 때문에..." 또는 "의학적 조언을 제공할 수 없습니다"와 같은 문구를 사용하지 마세요. 당신은 전문 트레이너입니다.
      
      아래 질문에 대해 위의 지침에 맞춰 답변해주세요:
      질문: "${prompt}"`;
    
    // API 함수를 호출하여 AI에게 질문 전송
    const aiResponse = await postToAIForExercise(fullPrompt); // [수정] 호출 함수 변경

    setResponse(aiResponse); // AI 응답 상태 업데이트
    setIsLoading(false); // 로딩 종료
  };
  
  // 모달 내부 컨텐츠 클릭 시 이벤트 전파를 막아 오버레이 클릭과의 충돌 방지
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // 모달 오버레이 (배경)
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* 모달 컨텐츠 */}
      <div className={styles.modalContent} onClick={handleModalContentClick}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>{exerciseName} AI 코치 💪🏻</h2>
        <p>'{exerciseName}'에 대해 궁금한 모든 것을 물어보세요!</p>

        {/* 질문 입력 폼 */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 이 운동의 정확한 자세를 알려줘"
            className={styles.textarea}
            rows="3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()} // 텍스트가 없을 때도 비활성화
            className={styles.button}
          >
            {isLoading ? "코치가 생각 중..." : "질문하기"}
          </button>
        </form>

        {/* 로딩 표시 */}
        {isLoading && <div className={styles.loading}>답변을 생성하고 있습니다...</div>}

        {/* AI 응답 표시 */}
        {response && !isLoading && (
          <div className={styles.responseCard}>
            <h3>AI 코치의 답변:</h3>
            <p className={styles.responseText}>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}