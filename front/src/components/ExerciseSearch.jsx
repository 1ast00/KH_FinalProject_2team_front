import React from 'react';
import styles from '../css/ExerciseListPage.module.css';

function ExerciseSearch({ searchTerm, onSearchTermChange }) {
  return (
    <input
      type="text"
      placeholder="운동명 검색..."
      value={searchTerm} // 부모로부터 받은 검색어를 input 값으로 표시
      // input 값이 변경될 때마다 부모의 onSearchTermChange 함수 호출해서 상태업데이트(실시간 검색)
      onChange={(e) => onSearchTermChange(e.target.value)} 
      className={styles.searchInput}
    />
  );
}

export default ExerciseSearch;