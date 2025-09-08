import { useEffect, useMemo, useState } from "react";
import styles from "../css/HealthDailyLog.module.css";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export default function HealthDailyLogForm({ initial, onCancel, onSubmit }) {
  // 초기 날짜
  const initialDate = useMemo(() => {
    if (initial?.hdate) return initial.hdate.slice(0, 10);
    if (initial?.hdateStr) return initial.hdateStr.replace(/\./g, "-");
    return todayStr();
  }, [initial]);

  // 수면시간 초기값
  const initHH = useMemo(
    () => (initial?.sleeptimeStr ? initial.sleeptimeStr.split(":")[0] : ""),
    [initial]
  );
  const initMM = useMemo(
    () => (initial?.sleeptimeStr ? initial.sleeptimeStr.split(":")[1] : ""),
    [initial]
  );

  // 로컬 상태
  const [hdate, setHdate] = useState(initialDate);
  const [sleepH, setSleepH] = useState(initHH);
  const [sleepM, setSleepM] = useState(initMM);
  const [weight, setWeight] = useState(initial?.weight ?? "");
  const [wateramount, setWateramount] = useState(initial?.wateramount ?? "");
  const [exercises, setExercises] = useState(
    initial?.exercise ? initial.exercise.split("\n") : [""]
  );
  const [foods, setFoods] = useState(initial?.food ? initial.food.split("\n") : [""]);

  // 팔레트
  const palette = [
    { key: "default", color: "#f6f6f6", title: "기본" },
    { key: "red",     color: "#FFE5E5", title: "연한빨강" },
    { key: "yellow",  color: "#FFF6CC", title: "연한노랑" },
    { key: "green",   color: "#C4EEAE", title: "연한초록" },
    { key: "pink",    color: "#FFE3EF", title: "연한핑크" },
    { key: "blue",    color: "#E0EEFF", title: "연한파랑" },
  ];
  const [selectedColor, setSelectedColor] = useState(palette[0].key);

  // 0906 폼 재초기화 - 시작
  useEffect(() => {
    setHdate(initialDate);
    setSleepH(initHH);
    setSleepM(initMM);
    setWeight(initial?.weight ?? "");
    setWateramount(initial?.wateramount ?? "");
    setExercises(initial?.exercise ? initial.exercise.split("\n") : [""]);
    setFoods(initial?.food ? initial.food.split("\n") : [""]);
  }, [initial, initialDate, initHH, initMM]);
  // 0906 폼 재초기화 - 끝

  const cleanList = (arr) =>
    arr.map((s) => (s ?? "")).filter((s) => s.trim().length > 0);

  // ---------- 입력 제한 유틸 ----------
  const encoder = new TextEncoder();
  const byteLen = (s) => encoder.encode(s || "").length;
  const cutBytes = (s, limit) => {
    if (byteLen(s) <= limit) return s || "";
    let lo = 0, hi = (s || "").length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      if (byteLen(s.slice(0, mid)) <= limit) lo = mid; else hi = mid - 1;
    }
    return s.slice(0, lo);
  };
  const limitChangeByBytes = (list, i, newVal, limitBytes) => {
    const others = list
      .map((v, idx) => (idx === i ? "" : (v ?? "")))
      .filter((v) => v.trim().length > 0);
    const othersJoined = others.join("\n");
    const baseBytes = byteLen(othersJoined);
    const sepBytes = othersJoined && (newVal ?? "").trim() ? 1 : 0;
    const allow = Math.max(0, limitBytes - baseBytes - sepBytes);
    const cut = cutBytes(newVal ?? "", allow);
    const next = list.slice();
    next[i] = cut;
    return next;
  };

  const enforceNum = (value, maxInt, maxFrac) => {
    let v = (value || "").replace(/[^\d.]/g, "");
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    const [iRaw = "", fRaw = ""] = v.split(".");
    let iPart = iRaw.replace(/^0+(?=\d)/, "");
    iPart = iPart.slice(0, maxInt);
    let fPart = fRaw.slice(0, maxFrac);
    if (v.includes(".")) return (iPart || "0") + "." + fPart;
    return iPart;
  };

  const handleWeightChange = (e) => setWeight(enforceNum(e.target.value, 3, 2));
  const handleHHChange = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 2);
    if (v !== "" && Number(v) > 23) v = "23";
    setSleepH(v);
  };
  const handleMMChange = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 2);
    if (v !== "" && Number(v) > 59) v = "59";
    setSleepM(v);
  };
  const handleWaterChange = (e) => setWateramount(enforceNum(e.target.value, 2, 1));

  const addExercise = () => setExercises((arr) => [...arr, ""]);
  const changeExercise = (i, v) =>
    setExercises((arr) => limitChangeByBytes(arr, i, v, 100));
  const addFood = () => setFoods((arr) => [...arr, ""]);
  const changeFood = (i, v) => setFoods((arr) => limitChangeByBytes(arr, i, v, 200));

  // 0906 팔레트 HEX 전송(카드 색 반영용) - 시작
  const colorHexFromKey = (key) => (palette.find((p) => p.key === key) || palette[0]).color;
  // 0906 팔레트 HEX 전송 - 끝

  const submit = () => {
    if (!hdate) return alert("날짜를 입력해 주세요.");

    const hh = sleepH === "" ? 0 : Math.max(0, Math.min(23, Number(sleepH)));
    const mm = sleepM === "" ? 0 : Math.max(0, Math.min(59, Number(sleepM)));
    const exJoined = cleanList(exercises).join("\n");
    const exerciseSafe = cutBytes(exJoined, 100);
    const foodJoined = cleanList(foods).join("\n");
    const foodSafeJoined = cutBytes(foodJoined, 200);
    const foodsSafe = foodSafeJoined ? foodSafeJoined.split("\n") : [];

    const payload = {
      hdate,
      sleeptime: `${pad2(hh)}:${pad2(mm)}`,
      weight: weight === "" ? null : Number(weight),
      wateramount: wateramount === "" ? null : Number(wateramount),
      exercise: exerciseSafe || "-",
      foods: foodsSafe,
      // 0906 팔레트 HEX 전송(여기가 핵심) - 시작
      cardColor: colorHexFromKey(selectedColor),
      // 0906 팔레트 HEX 전송 - 끝
      // (참고) colorKey는 보내도 되고 안 보내도 됩니다. Page는 cardColor(HEX)만 봅니다.
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

      {/* 몸무게 */}
      <div className={styles.formRow}>
        <input
          type="text"
          inputMode="decimal"
          placeholder="몸무게"
          value={weight}
          onChange={handleWeightChange}
          className={styles.inputRight}
        />
        <span className={styles.unit}>kg</span>
      </div>

      {/* 수면 시간 HH:MM */}
      <div className={styles.formRow}>
        <div className={styles.timeRow}>
          <div className={styles.inputWrap}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="수면 시간 (시)"
              value={sleepH}
              maxLength={2}
              onChange={handleHHChange}
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
              maxLength={2}
              onChange={handleMMChange}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* 물 */}
      <div className={styles.formRow}>
        <input
          type="text"
          inputMode="decimal"
          placeholder="물 섭취량"
          value={wateramount}
          onChange={handleWaterChange}
          className={styles.inputRight}
        />
        <span className={styles.unit}>L</span>
      </div>

      {/* 운동 */}
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

      {/* 식단 */}
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

      {/* 하단: 뒤로가기 + 팔레트 + 등록 */}
      <div className={styles.formActions}>
        <button onClick={onCancel} className={styles.outlineBtn}>뒤로가기</button>

        <div className={styles.actionRight}>
          <div className={styles.paletteWrap} aria-label="색상 팔레트">
            {palette.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`${styles.swatch} ${selectedColor === p.key ? styles.swatchSel : ""}`}
                title={p.title}
                style={{ background: p.color }}
                onClick={() => setSelectedColor(p.key)}
              />
            ))}
          </div>

          <button onClick={submit} className={styles.primaryBtn}>등록하기</button>
        </div>
      </div>
    </div>
  );
}
