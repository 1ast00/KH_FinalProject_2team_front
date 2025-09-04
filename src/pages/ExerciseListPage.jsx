import React, { useState, useEffect, useCallback } from 'react';
import ExerciseList from '../components/ExerciseList';
import ExerciseSearch from '../components/ExerciseSearch';
import ExerciseFilter from '../components/ExerciseFilter';
import { getExerciseData, getRecommendedExercises } from '../service/exerciseApi';
import { getCurrentWeather } from '../service/weatherApi'; // 날씨 API 서비스 import
import styles from '../css/ExerciseListPage.module.css';
import { Link } from 'react-router-dom';

export default function ExerciseListPage() {
  // 상태
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [displayHealthData, setDisplayHealthData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const fetchWeather = async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const weatherData = await getCurrentWeather(latitude, longitude);
              setWeather(weatherData);
            },
            async (error) => {
              console.warn("위치 정보를 가져올 수 없습니다. 기본 위치(서울)로 날씨를 조회합니다.", error);
              const weatherData = await getCurrentWeather(37.5665, 126.9780);
              setWeather(weatherData);
            }
          );
        } else {
            console.warn("이 브라우저는 위치 정보 기능을 지원하지 않습니다.");
            const weatherData = await getCurrentWeather(37.5665, 126.9780); 
            setWeather(weatherData);
        }
      };

      // 운동 데이터와 날씨 데이터를 동시에 요청
      await Promise.all([
        (async () => {
          const [allData, recommendedData] = await Promise.all([
            getExerciseData(),
            getRecommendedExercises(),
          ]);
          setHealthData(allData);
          setRecommended(recommendedData);
        })(),
        fetchWeather(),
      ]);

      setLoading(false);
    };
    fetchData();
  }, []);

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
      
      {recommended.length > 0 && (
        <div className={styles.recommendationContainer}>
            <div className={styles.recommendationHeader}>
              <h2 className={styles.recommendationTitle}>🚴🏻‍♀️ 오늘의 추천 운동</h2>
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