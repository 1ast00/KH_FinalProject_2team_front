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

  // 0907 AI 피드백 스위치 상태 추가 - 시작
  const [aiOn, setAiOn] = useState(false);
  // 0907 AI 피드백 스위치 상태 추가 - 끝

  // 팔레트
  const palette = [
    { key: "default", color: "#fff", title: "기본" },
    { key: "gray",     color: "#E8E8E8", title: "연한회색" },
    { key: "yellow",   color: "#FFF6CC", title: "연한노랑" },
    { key: "green",    color: "#C4EEAE", title: "연한초록" },
    { key: "pink",     color: "#FFE3EF", title: "연한핑크" },
    { key: "blue",     color: "#E0EEFF", title: "연한파랑" },
  ];
  const [selectedColor, setSelectedColor] = useState(palette[0].key);

  /* 0908 기존 색상 복원 - 시작 */
  const keyFromHex = (hex) => {
    if (!hex) return palette[0].key;
    const found = palette.find(p => (p.color || "").toLowerCase() === (hex || "").toLowerCase());
    return found ? found.key : palette[0].key;
  };
  /* 0908 기존 색상 복원 - 끝 */

  // 0906 폼 재초기화 - 시작
  useEffect(() => {
    setHdate(initialDate);
    setSleepH(initHH);
    setSleepM(initMM);
    setWeight(initial?.weight ?? "");
    setWateramount(initial?.wateramount ?? "");
    setExercises(initial?.exercise ? initial.exercise.split("\n") : [""]);
    setFoods(initial?.food ? initial.food.split("\n") : [""]);

    /* 0908 기존 색상 복원 - 시작 */
    setSelectedColor(keyFromHex(initial?.bgcolor));
    /* 0908 기존 색상 복원 - 끝 */
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

  // 0907 AI 프롬프트 조립 - 시작
  const buildAiPrompt = (payload) => {
    const {
      hdate, sleeptime, weight, wateramount, exercise, foods = []
    } = payload;
    return [
      "당신은 다정한 건강 코치입니다. 항상 칭찬모드로 간단·긍정적으로 피드백하세요.",
      "출력 형식:",
      "3줄 요약(칭찬 위주 + 부드러운 개선 1가지)",
      "개선 1가지와 관련한 다이어트 정보도 200자이내로 주세요",
      "",
      `기록: 날짜 ${hdate}, 몸무게 ${weight ?? "-"}kg, 수면 ${sleeptime}, 물 ${wateramount ?? "-"}L,`,
      `운동: ${exercise},`,
      `식단: ${foods.join(", ") || "-"}`,
      "",
    ].join("\n");
  };
  // 0907 AI 프롬프트 조립 - 끝

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
      // 0907 AI ON/OFF + 프롬프트 전달 - 시작
      aiOn,
      aiPrompt: buildAiPrompt({
        hdate,
        sleeptime: `${pad2(hh)}:${pad2(mm)}`,
        weight: weight === "" ? null : Number(weight),
        wateramount: wateramount === "" ? null : Number(wateramount),
        exercise: exerciseSafe || "-",
        foods: foodsSafe,
      }),
      // 0907 AI ON/OFF + 프롬프트 전달 - 끝
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

      {/* 하단: 뒤로가기 + (AI스위치 + 팔레트) + 등록 */}
      <div className={styles.formActions}>
        <button onClick={onCancel} className={styles.outlineBtn}>뒤로가기</button>

        <div className={styles.actionRight}>
          {/* 0907 AI 스위치 추가 - 시작 */}
          <button
            type="button"
            className={`${styles.aiSwitch} ${aiOn ? styles.aiSwitchOn : ""}`}
            onClick={() => setAiOn((v) => !v)}
            title="AI 피드백"
          >
            <span className={styles.aiKnob} />
            <span className={styles.aiLabel}>AI 피드백</span>
          </button>
          {/* 0907 AI 스위치 추가 - 끝 */}

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
