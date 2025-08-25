import React from 'react';
import styles from '../css/ExerciseListPage.module.css';

// 정렬 기준을 선택하는 드롭다운 UI 컴포넌트
function ExerciseFilter({ onSortChange, sortCriteria, sortOrder }) {
  // 부모 컴포넌트로부터 받은 정렬 기준과 순서를 합쳐 select의 현재 값으로 사용
  const value = sortCriteria && sortOrder ? `${sortCriteria}-${sortOrder}` : '';

  return (
    <select
      onChange={onSortChange} // 값이 변경되면 부모의 onSortChange 함수를 호출
      className={styles.sortSelect}
      value={value}
    >
      <option value="">정렬</option>
      <option value="운동명-asc">운동명 (오름차순)</option>
      <option value="운동명-desc">운동명 (내림차순)</option>
      <option value="단위체중당에너지소비량-asc">소비 에너지 (낮은 순)</option>
      <option value="단위체중당에너지소비량-desc">소비 에너지 (높은 순)</option>
    </select>
  );
}

export default ExerciseFilter;