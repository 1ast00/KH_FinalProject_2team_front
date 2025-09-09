import React, { useState } from "react";
import styles from "../css/Gemini.module.css";

export default ({ handleSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    gender: "",
    ageGroup: "",
    height: "",
    weight: "",
    goalWeight: "",
    period: "",
    activity: "",
    dietPreference: "",
    allergies: "",
    health: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // 필수값 체크
    if (!formData.height || !formData.weight) {
      alert("신장과 현재 체중은 반드시 입력해주세요!");
      return;
    }

    handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>      
      {/* 신장 */}
      <label>신장 (cm) *</label>
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={handleChange}
        placeholder="예: 170"
        required
      />

      {/* 현재 체중 */}
      <label>현재 체중 (kg) *</label>
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
        placeholder="예: 65"
        required
      />

      {/* 성별 */}
      <label>성별</label>
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">선택하세요</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>

      {/* 연령대 */}
      <label>연령대</label>
      <select name="ageGroup" value={formData.ageGroup} onChange={handleChange}>
        <option value="">선택하세요</option>
        <option value="10">10대</option>
        <option value="20">20대</option>
        <option value="30">30대</option>
        <option value="40">40대</option>
        <option value="50">50대</option>
        <option value="60">60대 이상</option>
      </select>

      {/* 목표 체중 */}
      <label>목표 체중 (kg)</label>
      <input
        type="number"
        name="goalWeight"
        value={formData.goalWeight}
        onChange={handleChange}
        placeholder="예: 60"
      />

      {/* 목표 기간 */}
      <label>목표 기간</label>
      <select name="period" value={formData.period} onChange={handleChange}>
        <option value="">선택하세요</option>
        <option value="1month">1개월</option>
        <option value="2month">2개월</option>
        <option value="3month">3개월</option>
        <option value="6month">6개월</option>
      </select>

      {/* 신체 활동 수준 */}
      <label>신체 활동 수준</label>
      <select name="activity" value={formData.activity} onChange={handleChange}>
        <option value="">선택하세요</option>
        <option value="low">거의 활동 없음</option>
        <option value="light">가벼운 활동 (주 1~3회 운동)</option>
        <option value="moderate">적당한 활동 (주 3~5회 운동)</option>
        <option value="high">활발한 활동 (거의 매일 운동)</option>
      </select>

      {/* 식사 습관 */}
      <label>식사 습관</label>
      <select
        name="dietPreference"
        value={formData.dietPreference}
        onChange={handleChange}
      >
        <option value="">선택하세요</option>
        <option value="normal">일반식</option>
        <option value="vegetarian">채식</option>
        <option value="highProtein">고단백식</option>
        <option value="lowCarb">저탄수화물식</option>
      </select>

      {/* 알레르기 */}
      <label>알레르기</label>
      <input
        type="text"
        name="allergies"
        value={formData.allergies}
        onChange={handleChange}
        placeholder="예: 우유, 땅콩"
      />

      {/* 기저 질환 */}
      <label>기저 질환</label>
      <input
        type="text"
        name="health"
        value={formData.health}
        onChange={handleChange}
        placeholder="예: 당뇨, 고혈압"
      />

      {/* 제출 버튼 */}
      <button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? "맞춤형 다이어트 플랜 설계 중..." : "플랜 생성하기"}
      </button>
    </form>
  );
};