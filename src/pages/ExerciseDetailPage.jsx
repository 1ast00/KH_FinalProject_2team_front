import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { getExerciseData } from '../service/exerciseApi';
import { isAuthenticated } from '../util/authUtil';
import ExerciseAiChat from '../components/ExerciseAiChat';

import styles from '../css/ExerciseDetailPage.module.css';

// 개별 운동의 상세 정보를 보여주는 페이지 컴포넌트
export default function ExerciseDetailPage() {
  const { exerciseName } = useParams();
  const location = useLocation();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  const [weight, setWeight] = useState('');
  const [weightError, setWeightError] = useState('');
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const findExercise = async () => {
      const decodedExerciseName = decodeURIComponent(exerciseName);
      let data = location.state?.healthData;
      if (!data) {
        data = await getExerciseData();
      }
      const foundExercise = data.find(
        (item) => item['운동명'] === decodedExerciseName
      );
      setExercise(foundExercise);
      setLoading(false);
    };
    findExercise();
  }, [exerciseName, location.state]);

  // AI 버튼 클릭 처리
  const handleAiButtonClick = () => {
    if (!isAuthenticated()) {
      alert('AI 코치 기능은 로그인 후 이용 가능합니다.');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  // MET 값에 따른 운동 강도 레벨 반환
  const getExerciseIntensity = (met) => {
    if (met < 3.0) return { level: '가벼운 운동', style: 'light' };
    if (met >= 3.0 && met < 6.0) return { level: '적당한 운동', style: 'moderate' };
    return { level: '격렬한 운동', style: 'intense' };
  };

  if (loading) {
    return <div className={styles.detailContainer}>데이터를 불러오는 중...</div>;
  }

  if (!exercise) {
    return (
      <div className={styles.detailContainer}>
        <h2>운동 정보를 찾을 수 없습니다.</h2>
        <Link to="/exercise">목록으로 돌아가기</Link>
      </div>
    );
  }

  // 칼로리 계산
  const handleCalculate = () => {
    const met = parseFloat(exercise['단위체중당에너지소비량']);
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      alert('올바른 체중을 입력해주세요.');
      return;
    }
    const hours = Number(duration) / 60;
    const kcal = met * w * hours;
    setCalories(kcal.toFixed(1));
  };

  const metValue = parseFloat(exercise['단위체중당에너지소비량']);
  const intensity = getExerciseIntensity(metValue);

  const handleWeightChange = (e) => {
    const value = e.target.value;
    setCalories(null);
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setWeight(value);
      setWeightError('');
    } else {
      setWeightError('📢숫자를 입력해주세요!');
    }
  };

  // 분당 칼로리 소모량 계산
  const kcalPerMin = (() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0 || isNaN(metValue)) return null;
    return ((metValue * w) / 60).toFixed(1);
  })();

  return (
    <div className={styles.detailContainer}>
      {/* 운동명 */}
      <h1 className={styles.detailTitle}>{exercise['운동명']}</h1>

      {/* 칼로리 계산기 카드 */}
      <div className={styles.calculatorBox}>
        <img src="/img/exercise_2.png" alt="배경" className={styles.pageBackgroundImage} />
        <div className={styles.detailInfo}>
          <p><strong>MET :</strong> <span>{metValue}</span></p>
          <p><strong>에너지 소비량 :</strong> <span>MET × 체중(kg) × 시간(hr)</span></p>
          <p><strong>운동 강도 :</strong> <span className={`${styles.intensityBadge} ${styles[intensity.style]}`}>{intensity.level}</span></p>
        </div>
        <hr className={styles.divider} />
        <h2>소모 칼로리 계산기</h2>

        {/* 체중 입력 */}
        <div className={styles.inputGroup}>
          <label htmlFor="weight">체중 (kg)</label>
          <input id="weight" type="text" value={weight} onChange={handleWeightChange} placeholder="예: 70" />
          <div className={styles.messageContainer}>
            {weightError && <div className={styles.errorText}>{weightError}</div>}
            {!weightError && kcalPerMin && (
              <div className={styles.hintBox}>
                <small>📌 분당 약 {kcalPerMin} kcal 소모합니다.</small>
              </div>
            )}
          </div>
        </div>

        {/* 운동 시간 선택 */}
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

        {/* 계산 버튼 */}
        <button onClick={handleCalculate} className={styles.calculateBtn}>계산하기</button>

        {/* 계산 결과 */}
        <div className={styles.resultsWrapper}>
          {!weightError && calories !== null && (
            <div className={styles.resultBox}>
              <p><strong>{exercise['운동명']}</strong> 운동을 <strong>{duration}분</strong> 동안 하시면<br />약 <strong className={styles.resultCalories}>{calories} kcal</strong>를 소모합니다!</p>
            </div>
          )}
        </div>

        {/* AI 코치 & 목록으로 돌아가기 (같은 라인) */}
        <div className={styles.backLinkContainer}>
          <button onClick={handleAiButtonClick} className={styles.aiButton}>
            AI 운동 코치
          </button>
          <Link to="/exercise" className={styles.backLink}>
            목록
          </Link>
        </div>
      </div>

      {/* isModalOpen이 true일 때만 ExerciseAiChat 렌더링 */}
      {isModalOpen && (
        <ExerciseAiChat 
          exerciseName={exercise['운동명']} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
