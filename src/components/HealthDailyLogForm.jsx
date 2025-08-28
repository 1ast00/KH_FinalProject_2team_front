import { useMemo, useState } from "react";
import styles from "../css/HealthDailyLog.module.css";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export default function HealthDailyLogForm({ initial, onCancel, onSubmit }) {
  // 날짜
  const [hdate, setHdate] = useState(initial?.hdate?.slice?.(0, 10) || todayStr());

  // 수면시간(시/분) - 플레이스홀더 보이게 기본값은 빈 문자열
  const initHH = useMemo(
    () => (initial?.sleeptimeStr ? initial.sleeptimeStr.split(":")[0] : ""),
    [initial]
  );
  const initMM = useMemo(
    () => (initial?.sleeptimeStr ? initial.sleeptimeStr.split(":")[1] : ""),
    [initial]
  );
  const [sleepH, setSleepH] = useState(initHH);
  const [sleepM, setSleepM] = useState(initMM);

  // 숫자 필드
  const [weight, setWeight] = useState(initial?.weight ?? "");
  const [wateramount, setWateramount] = useState(initial?.wateramount ?? "");

  // 다중 입력
  const [exercises, setExercises] = useState(
    initial?.exercise ? initial.exercise.split("\n") : [""]
  );
  const [foods, setFoods] = useState(initial?.food ? initial.food.split("\n") : [""]);

  const cleanList = (arr) =>
    arr.map((s) => (s || "").trim()).filter((s) => s.length > 0);

  const onlyNumber = (e, allowDot = false) => {
    const ok = "0123456789" + (allowDot ? "." : "");
    if (e.key.length === 1 && !ok.includes(e.key)) e.preventDefault();
  };

  // 아래로 추가(append)
  const addExercise = () => setExercises((arr) => [...arr, ""]);
  const changeExercise = (i, v) =>
    setExercises((arr) => arr.map((x, idx) => (idx === i ? v : x)));

  const addFood = () => setFoods((arr) => [...arr, ""]);
  const changeFood = (i, v) => setFoods((arr) => arr.map((x, idx) => (idx === i ? v : x)));

  const submit = () => {
    if (!hdate) return alert("날짜를 입력해 주세요.");
    if (weight === "" || isNaN(Number(weight)))
      return alert("오늘 몸무게를 입력해 주세요.");
    if (wateramount === "" || isNaN(Number(wateramount)))
      return alert("물 섭취량을 숫자로 입력해 주세요.");

    const hh = sleepH === "" ? 0 : Math.max(0, Math.min(23, Number(sleepH)));
    const mm = sleepM === "" ? 0 : Math.max(0, Math.min(59, Number(sleepM)));
    const payload = {
      hdate,
      sleeptime: `${pad2(hh)}:${pad2(mm)}`,
      weight: Number(weight),
      wateramount: Number(wateramount),
      exercise: cleanList(exercises).join("\n") || "-",
      foods: cleanList(foods),
    };
    onSubmit(payload);
  };

  return (
    <div className={styles.form}>
      {/* 날짜 */}
      <div className={styles.formRow}>
        <input
          type="date"
          value={hdate}
          onChange={(e) => setHdate(e.target.value)}
          className={styles.input}
        />
      </div>

      {/* 몸무게 (숫자만, 스피너 제거) */}
      <div className={styles.formRow}>
        <input
          type="text"
          inputMode="decimal"
          placeholder="몸무게"
          value={weight}
          onKeyDown={(e) => onlyNumber(e, true)}
          onChange={(e) => setWeight(e.target.value)}
          className={styles.inputRight}
        />
        <span className={styles.unit}>kg</span>
      </div>

      {/* 수면 시간 HH:MM - 같은 행/같은 폭 */}
      <div className={styles.formRow}>
        <div className={styles.timeRow}>
          <div className={styles.inputWrap}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="수면 시간 (시)"
              value={sleepH}
              onKeyDown={(e) => onlyNumber(e, false)}
              onChange={(e) => setSleepH(e.target.value.replace(/\D/g, ""))}
              className={styles.input}
            />
          </div>
          <span className={styles.timeSep}>:</span>
          <div className={styles.inputWrap}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="수면 시간 (분)"
              value={sleepM}
              onKeyDown={(e) => onlyNumber(e, false)}
              onChange={(e) => setSleepM(e.target.value.replace(/\D/g, ""))}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* 물 (숫자만, 스피너 제거) */}
      <div className={styles.formRow}>
        <input
          type="text"
          inputMode="decimal"
          placeholder="물 섭취량"
          value={wateramount}
          onKeyDown={(e) => onlyNumber(e, true)}
          onChange={(e) => setWateramount(e.target.value)}
          className={styles.inputRight}
        />
        <span className={styles.unit}>L</span>
      </div>

      {/* 운동 (+버튼: 마지막 입력칸 안쪽 오른쪽 / 아래로 추가) */}
      <div className={styles.formRow}>
        <div className={styles.foodInputBlock}>
          {exercises.map((t, i) => (
            <div key={i} className={styles.inputWrap}>
              <input
                value={t}
                onChange={(e) => changeExercise(i, e.target.value)}
                placeholder="운동"
                className={`${styles.input} ${i === exercises.length - 1 ? styles.inputWithAddon : ""}`}
              />
              {i === exercises.length - 1 && (
                <button title="운동 추가" onClick={addExercise} className={styles.insidePlus}>
                  ＋
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 식단 (+버튼: 마지막 입력칸 안쪽 오른쪽 / 아래로 추가) */}
      <div className={styles.formRow}>
        <div className={styles.foodInputBlock}>
          {foods.map((f, i) => (
            <div key={i} className={styles.inputWrap}>
              <input
                value={f}
                onChange={(e) => changeFood(i, e.target.value)}
                placeholder="식단"
                className={`${styles.input} ${i === foods.length - 1 ? styles.inputWithAddon : ""}`}
              />
              {i === foods.length - 1 && (
                <button title="식단 추가" onClick={addFood} className={styles.insidePlus}>
                  ＋
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formActions}>
        <button onClick={onCancel} className={styles.outlineBtn}>뒤로가기</button>
        <button onClick={submit} className={styles.primaryBtn}>등록하기</button>
      </div>
    </div>
  );
}
