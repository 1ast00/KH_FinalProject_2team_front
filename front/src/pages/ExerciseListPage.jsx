import React, { useState, useEffect, useCallback } from 'react'; // 리액트 및 훅 import
import ExerciseList from '../components/ExerciseList'; // 운동 목록 컴포넌트
import ExerciseSearch from '../components/ExerciseSearch'; // 검색창 컴포넌트
import ExerciseFilter from '../components/ExerciseFilter'; // 정렬 필터 컴포넌트
import { getExerciseData } from '../service/exerciseApi'; // API 호출 함수 import
import styles from '../css/ExerciseListPage.module.css'; // CSS 모듈 import
import BannerImage from '../assets/images/exercise-banner.png'; // 배너 이미지 import

// 운동 목록을 보여주는 메인 페이지 컴포넌트
export default function ExerciseListPage() {

  // 상태(State)
  const [healthData, setHealthData] = useState([]); // API로부터 받아온 원본 운동 데이터
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태 (true: 로딩중, false: 로딩완료)
  
  const [displayHealthData, setDisplayHealthData] = useState([]); // 화면에 실제로 보여줄 필터링/정렬된 운동 데이터
  const [searchTerm, setSearchTerm] = useState(''); // 사용자가 입력한 검색어
  const [sortCriteria, setSortCriteria] = useState(''); // 정렬 기준 (예: '운동명')
  const [sortOrder, setSortOrder] = useState('asc'); // 정렬 순서 ('asc': 오름차순, 'desc': 내림차순)

  // 효과(Effect)
  // 1. 컴포넌트가 처음 마운트될 때 API를 호출하여 운동 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 로딩 시작
      const data = await getExerciseData(); // API 호출
      setHealthData(data); // 받아온 데이터로 상태 업데이트
      setLoading(false); // 로딩 완료
    };
    fetchData();
  }, []); // 빈 배열을 전달하여 최초 1회만 실행

  // 2. 검색어, 정렬 기준 등이 변경될 때마다 화면에 보여줄 데이터를 필터링하고 정렬함
  useEffect(() => {
    // 원본 데이터에서 검색어가 포함된 항목만 필터링
    const filteredData = healthData.filter(item =>
      item && item['운동명'] && item['운동명'].toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 정렬 기준이 있으면 데이터 정렬
    if (sortCriteria) {
      filteredData.sort((a, b) => {
        let aValue, bValue;
        if (sortCriteria === '운동명') {
          aValue = a['운동명'];
          bValue = b['운동명'];
        } else if (sortCriteria === '단위체중당에너지소비량') {
          aValue = parseFloat(a['단위체중당에너지소비량']);
          bValue = parseFloat(b['단위체중당에너지소비량']);
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    // 최종적으로 화면에 보여줄 데이터 상태를 업데이트
    setDisplayHealthData(filteredData);
  }, [searchTerm, sortCriteria, sortOrder, healthData]); // 의존성 배열: 이 값들이 바뀔 때마다 실행

  // 이벤트 핸들러
  // 정렬 필터의 값이 변경될 때 호출되는 함수
  const handleSortChange = useCallback((e) => {
    const value = e.target.value; // 예: "운동명-asc"
    const [criteria, order] = value.split('-'); // 기준과 순서로 분리
    setSortCriteria(criteria);
    setSortOrder(order);
  }, []); // 빈 배열을 전달하여 함수가 재생성되지 않도록 함

  // 렌더링
  return (
    <div className={styles.appContainer}>
      <img src={BannerImage} alt="운동 추천 배너" className={styles.bannerImage} />
      
      {/* MET 설명 + 검색창 + 정렬 */}
      <div className={styles.metAndControls}>
        {/* MET 설명 */}
        <div className={styles.metExplanation}>
          <p>
            <strong className={styles.metHighlight}>MET</strong> : 운동 강도를 나타내는 값으로, 숫자가 높을수록 칼로리 소모가 많다는 의미에요💡
          </p>
        </div>
        {/* 검색창 + 정렬 필터 */}
        <div className={styles.controls}>
          {/* 검색창 컴포넌트 */}
          <ExerciseSearch searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
          {/* 정렬 필터 컴포넌트 */}
          <ExerciseFilter onSortChange={handleSortChange} sortCriteria={sortCriteria} sortOrder={sortOrder} />
        </div>
      </div>
      {/* 운동 목록 컴포넌트 */}
      <ExerciseList healthData={displayHealthData} loading={loading} />
    </div>
  );
}
