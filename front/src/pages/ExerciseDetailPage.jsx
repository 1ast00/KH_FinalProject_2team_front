import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom'; // 리액트 라우터 훅
import { getExerciseData } from '../service/exerciseApi'; // API 호출 함수 import

import styles from '../css/ExerciseDetailPage.module.css';

// 개별 운동의 상세 정보를 보여주는 페이지 컴포넌트
export default function ExerciseDetailPage() {

  const { exerciseName } = useParams(); // URL 파라미터 훅(예: /exercise/걷기 -> '걷기')
  const location = useLocation(); // 이 전 페이지의 데이터 가져오기
  const [exercise, setExercise] = useState(null); // 특정 운동 데이터
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태

  // 칼로리 계산기 관련 상태
  const [weight, setWeight] = useState(''); // 사용자 체중
  const [duration, setDuration] = useState(30); // 운동 시간 (기본값 30분)
  const [calories, setCalories] = useState(null); // 계산된 소모 칼로리

  // 컴포넌트가 마운트되거나 운동 이름이 바뀔 때, 해당 운동 데이터를 찾거나 API로 가져옴
  useEffect(() => {
    const findExercise = async () => {
      // URL 파라미터는 인코딩되어 있을 수 있으므로 디코딩
      const decodedExerciseName = decodeURIComponent(exerciseName);
      // 목록 페이지에서 Link state로 전달받은 전체 데이터가 있는지 확인
      let data = location.state?.healthData;

      // 전달받은 데이터가 없으면(예:URL로 직접 접속) API를 새로 호출
      if (!data) {
        data = await getExerciseData(); 
      }
      
      // 전체 데이터에서 현재 URL에 맞는 운동을 찾음
      const foundExercise = data.find(
        (item) => item['운동명'] === decodedExerciseName
      );
      setExercise(foundExercise); // 찾은 운동 데이터로 상태 업데이트
      setLoading(false); // 로딩 완료
    };

    findExercise();
  }, [exerciseName, location.state]); // 의존성 배열: 이 값들이 바뀔 때마다 실행

  // MET 값에 따라 운동 강도를 반환하는 함수
  const getExerciseIntensity = (met) => {
    if (met < 3.0) return { level: '가벼운 운동', style: 'light' };
    if (met >= 3.0 && met < 6.0) return { level: '적당한 운동', style: 'moderate' };
    return { level: '격렬한 운동', style: 'intense' };
  };

  // 데이터 로딩 중일 때 보여줄 UI(조건부 랜더링)
  if (loading) {
    return <div className={styles.detailContainer}>데이터를 불러오는 중...</div>;
  }

  // 운동 정보를 찾지 못했을 때 보여줄 UI
  if (!exercise) {
    return (
      <div className={styles.detailContainer}>
        <h2>운동 정보를 찾을 수 없습니다.</h2>
        <Link to="/exercise">목록으로 돌아가기</Link>
      </div>
    );
  }

  // 계산하기 버튼 클릭 시 소모 칼로리를 계산하는 함수
  const handleCalculate = () => {
    const met = parseFloat(exercise['단위체중당에너지소비량']);
    const w = parseFloat(weight);
    // 체중 값이 유효하지 않으면 알림창을 띄우고 종료
    if (isNaN(w) || w <= 0) {
      alert('올바른 체중을 입력해주세요.');
      return;
    }
    const hours = Number(duration) / 60; // 분을 시간으로 변환
    const kcal = met * w * hours; // 칼로리 계산 공식
    setCalories(kcal.toFixed(1)); // 소수점 첫째 자리까지 표시
  };

  // 렌더링을 위한 데이터 가공
  const metValue = parseFloat(exercise['단위체중당에너지소비량']);
  const intensity = getExerciseIntensity(metValue);

  // 체중 입력 시 실시간으로 분당 소모 칼로리를 계산
  const kcalPerMin = (() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0 || isNaN(metValue)) return null;
    return ((metValue * w) / 60).toFixed(1); // 분당 칼로리 계산
  })();

  // 렌더링
  return (
    <div className={styles.detailContainer}>
      <h1 className={styles.detailTitle}>{exercise['운동명']}</h1>
      {/* 운동 기본 정보 */}
      <div className={styles.detailInfo}>
        <p><strong>MET :</strong> <span>{metValue}</span></p>
        <p><strong>에너지 소비량 :</strong> <span>MET × 체중(kg) × 시간(hr)</span></p>
        <p><strong>운동 강도 :</strong> <span className={`${styles.intensityBadge} ${styles[intensity.style]}`}>{intensity.level}</span></p>
      </div>
      {/* 칼로리 계산기 */}
      <div className={styles.calculatorBox}>
        <h2>소모 칼로리 계산기</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="weight">체중 (kg)</label>
          <input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="예: 70" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="duration">운동 시간</label>
          <select id="duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            <option value={10}>10분</option>
            <option value={20}>20분</option>
            <option value={30}>30분</option>
            <option value={45}>45분</option>
            <option value={60}>1시간</option>
            <option value={90}>1시간 30분</option>
            <option value={120}>2시간</option>
          </select>
        </div>
        <button onClick={handleCalculate} className={styles.calculateBtn}>계산하기</button>
        {/* 분당 소모 칼로리 (체중 입력 시 보임) */}
        {kcalPerMin && <div className={styles.hintBox}><small>분당 약 {kcalPerMin} kcal 소모</small></div>}
        {/* 계산 결과 (계산하기 버튼 클릭 시 보임) */}
        {calories !== null && <div className={styles.resultBox}><p>약 <strong className={styles.resultCalories}>{calories} kcal</strong>를 소모합니다!</p></div>}
      </div>
      {/* 목록으로 돌아가기 링크 */}
      <div className={styles.backLinkContainer}>
        <Link to="/exercise" className={styles.backLink}>
          목록으로 돌아가기 →
        </Link>
      </div>
    </div>
  );
}