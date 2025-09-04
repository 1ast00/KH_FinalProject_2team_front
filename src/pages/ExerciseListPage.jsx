import React, { useState, useEffect, useCallback } from 'react';
import ExerciseList from '../components/ExerciseList';
import ExerciseSearch from '../components/ExerciseSearch';
import ExerciseFilter from '../components/ExerciseFilter';
import { getExerciseData, getRecommendedExercises } from '../service/exerciseApi';
import { getCurrentWeather } from '../service/weatherApi';
import styles from '../css/ExerciseListPage.module.css';
import { Link } from 'react-router-dom';

// 날씨 객체를 받아 추천할 운동 타입을 결정하는 함수
const getExerciseTypeByWeather = (weather) => {
    if (!weather) return '실외';

    const weatherIconCode = weather.icon.slice(0, 2);
    const temp = weather.temp;

    if (['09', '10', '11', '13', '50'].includes(weatherIconCode)) {
        return '실내';
    }
    if (temp > 30 || temp < 0) {
        return '실내';
    }
    return '실외';
};

export default function ExerciseListPage() {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [displayHealthData, setDisplayHealthData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [weather, setWeather] = useState(null);

  // 1. 전체 운동 목록과 날씨 정보를 먼저 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      const fetchWeather = new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => resolve(await getCurrentWeather(position.coords.latitude, position.coords.longitude)),
            async () => resolve(await getCurrentWeather(37.5665, 126.9780)) // 거부 시 서울 날씨
          );
        } else {
            resolve((async () => await getCurrentWeather(37.5665, 126.9780))()); // 미지원 시 서울 날씨
        }
      });

      const [allData, weatherData] = await Promise.all([
          getExerciseData(),
          fetchWeather,
      ]);

      setHealthData(allData);
      setWeather(weatherData);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  // 2. 날씨(weather) 정보가 확정되면, 그에 맞는 추천 운동을 요청
  useEffect(() => {
    if (!weather) return;

    const fetchRecommendations = async () => {
        const exerciseType = getExerciseTypeByWeather(weather);
        console.log(`오늘의 날씨 기반 추천 타입: ${exerciseType}`);
        const recommendedData = await getRecommendedExercises(exerciseType);
        setRecommended(recommendedData);
    };
    fetchRecommendations();
  }, [weather]);

  // 검색, 정렬 관련 로직
  useEffect(() => {
    const filteredData = healthData.filter(item =>
      item && item['운동명'] && item['운동명'].toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    setDisplayHealthData(filteredData);
  }, [searchTerm, sortCriteria, sortOrder, healthData]);

  const handleSortChange = useCallback((e) => {
    const value = e.target.value;
    const [criteria, order] = value.split('-');
    setSortCriteria(criteria);
    setSortOrder(order);
  }, []);

  return (
    <div className={styles.appContainer}>
      <img src="/img/exercise_1.png" alt="운동 추천 배너" className={styles.bannerImage} />
      
      {!loading && recommended.length > 0 && (
        <div className={styles.recommendationContainer}>
            <div className={styles.recommendationHeader}>
              <h2 className={styles.recommendationTitle}>🚴🏻‍♀️ 오늘의 추천 운동(WOD)</h2>
              {weather && (
                <div className={styles.weatherWidget}>
                  <img
                    className={styles.weatherIcon}
                    src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                  />
                  <div className={styles.weatherInfo}>
                    <span className={styles.weatherTemp}>{Math.round(weather.temp)}°C</span>
                    <span className={styles.weatherDesc}>{weather.city}, {weather.description}</span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.recommendationGrid}>
                {recommended.map((item, index) => (
                    <Link
                      to={`/exercise/${encodeURIComponent(item['운동명'])}`}
                      key={`rec-${index}`}
                      className={styles.dataCardLink}
                      state={{ healthData: healthData.length > 0 ? healthData : recommended }}
                    >
                        <div className={`${styles.dataCard} ${styles.recommendedCard}`}>
                            <h3 className={styles.cardTitle}>{item['운동명']}</h3>
                            <p className={styles.cardInfo}>
                                <span className={styles.cardInfoLabel}>MET:</span>{' '}
                                {item['단위체중당에너지소비량']}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      )}

      {/* 전체 운동 목록 */}
      <div className={styles.metAndControls}>
        <div className={styles.metExplanation}>
          <p>
            <strong className={styles.metHighlight}>MET</strong> : 운동 강도를 나타내는 값으로, 숫자가 높을수록 칼로리 소모가 많다는 의미에요💡
          </p>
        </div>
        <div className={styles.controls}>
          <ExerciseSearch searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
          <ExerciseFilter onSortChange={handleSortChange} sortCriteria={sortCriteria} sortOrder={sortOrder} />
        </div>
      </div>
      <ExerciseList healthData={displayHealthData} loading={loading} />
    </div>
  );
}