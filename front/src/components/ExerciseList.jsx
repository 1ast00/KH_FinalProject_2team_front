import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 이동(Link) 컴포넌트
import styles from '../css/ExerciseListPage.module.css';

// 운동 데이터 배열 받아서 목록 형태로 보여주는 컴포넌트
function ExerciseList({ healthData, loading }) {
  // 데이터 로딩 중일 때 보여줄 UI
  if (loading) {
    return <div className={styles.loading}>데이터를 불러오는 중...</div>;
  }

  return (
    <main className={styles.mainContent}>
      {/* 운동 목록 그리드 형태로 표시 */}
      <div className={styles.dataGrid}>
        {/* 데이터가 있고, 1개 이상일 경우에만 목록 랜더링 */}
        {healthData && healthData.length > 0 ? (
          healthData.map((item, index) => (
            // 각 운동 항목 클릭하면 상세 페이지로 이동
            <Link
              to={`/exercise/${encodeURIComponent(item['운동명'])}`}
              key={index}
              className={styles.dataCardLink}
              // state prop : 상세페이지로 전체 목록 데이터 전달(불필요한 API 호출 방지)
              state={{ healthData: healthData }}
            >
              <div className={styles.dataCard}>
                <h2 className={styles.cardTitle}>{item['운동명']}</h2>
                <p className={styles.cardInfo}>
                  <span className={styles.cardInfoLabel}>MET:</span>{' '}
                  {item['단위체중당에너지소비량']}
                </p>
                <p className={styles.cardSubInfo}>
                  <small>(= {item['단위체중당에너지소비량']} kcal / kg / hour)</small>
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className={styles.noDataMessage}>데이터가 없습니다.</p>
        )}
      </div>
    </main>
  );
}

export default ExerciseList;