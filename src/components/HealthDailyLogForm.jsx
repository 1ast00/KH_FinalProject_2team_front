import { useEffect, useRef, useState } from "react";
import styles from "../css/HealthDailyLog.module.css";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function HealthDailyLogForm({ initial, onCancel, onSubmit }) {
  const [hdate, setHdate] = useState(initial?.hdate?.slice(0,10) || todayStr());
  const [weight, setWeight] = useState(initial?.weight ?? "");
  const [sleeptime, setSleeptime] = useState(initial?.sleeptimeStr || "");
  const [wateramount, setWateramount] = useState(initial?.wateramount ?? "");
  const [exercise, setExercise] = useState(initial?.exercise || "");
  const [foods, setFoods] = useState(initial?.food ? initial.food.split("\n") : [""]);

  const addFood = () => setFoods((arr) => [...arr, ""]);
  const changeFood = (i, v) => setFoods((arr) => arr.map((x, idx) => idx === i ? v : x));
  const removeEmptyTail = (arr) => {
    const trimmed = arr.map(s => (s||"").trim());
    // 마지막 빈칸은 제거
    while (trimmed.length && !trimmed[trimmed.length-1]) trimmed.pop();
    return trimmed;
  };

  const handleSubmit = () => {
    if (!hdate) return alert("날짜를 입력해 주세요.");
    if (!wateramount) return alert("물 섭취량을 입력해 주세요.");
    const payload = {
      hdate, // YYYY-MM-DD
      sleeptime: sleeptime, // HH:MM
      weight: weight === "" ? null : Number(weight),
      wateramount: Number(wateramount),
      exercise,
      foods: removeEmptyTail(foods),
    };
    onSubmit(payload);
  };

  return (
    <div className={styles.form}>
      <div className={styles.formRow}>
        <input type="date" value={hdate} onChange={(e) => setHdate(e.target.value)} className={styles.input} />
      </div>

      <div className={styles.formRow}>
        <input type="number" step="0.1" placeholder="몸무게" value={weight} onChange={(e)=>setWeight(e.target.value)} className={styles.inputRight}/>
        <span className={styles.unit}>kg</span>
      </div>

      <div className={styles.formRow}>
        <input type="time" value={sleeptime} onChange={(e)=>setSleeptime(e.target.value)} className={styles.input}/>
      </div>

      <div className={styles.formRow}>
        <input type="number" step="0.1" placeholder="물 섭취량" value={wateramount} onChange={(e)=>setWateramount(e.target.value)} className={styles.inputRight}/>
        <span className={styles.unit}>L</span>
      </div>

      <div className={styles.formRow}>
        <input type="text" placeholder="운동" value={exercise} onChange={(e)=>setExercise(e.target.value)} className={styles.input}/>
      </div>

      <div className={styles.formRow}>
        <div className={styles.foodInputBlock}>
          {foods.map((f, i) => (
            <input key={i} value={f} onChange={(e)=>changeFood(i, e.target.value)} placeholder="식단" className={styles.input} />
          ))}
        </div>
        <button title="추가" onClick={addFood} className={styles.plusBtn}>＋</button>
      </div>

      <div className={styles.formActions}>
        <button onClick={onCancel} className={styles.outlineBtn}>뒤로가기</button>
        <button onClick={handleSubmit} className={styles.primaryBtn}>등록하기</button>
      </div>
    </div>
  );
}