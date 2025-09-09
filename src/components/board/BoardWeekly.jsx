import styles from "../../css/board/BoardWeekly.module.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, isAuthenticated } from "../../util/authUtil";
import { authApi } from "../../service/authApi";

// 참여하기 버튼 이벤트 (변경 없음)
const JoinButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={`${styles.btn_getin} ${isHovered ? styles.btn_expand : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered ? "＋ 참여하기" : <span className={styles.btn_plus}>＋</span>}
    </button>
  );
};

export default function BoardWeekly() {
  const [champions, setChampions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasParticipated, setHasParticipated] = useState(false);
  const ageGroups = [10, 20, 30, 40];
  const navigate = useNavigate();

  // [수정] 무한 루프를 유발하던 const loggedInUser = getUserData(); 라인을 삭제하고, 아래 state로 변경합니다.
  const [loggedInUser, setLoggedInUser] = useState(null);

  // [수정] 컴포넌트가 처음 로드될 때 딱 한 번만 실행되는 useEffect를 추가하여 사용자 정보를 state에 저장합니다.
  useEffect(() => {
    const user = getUserData();
    setLoggedInUser(user);
  }, []); // 의존성 배열이 '[]'이므로 최초 1회만 실행됩니다.

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const championsRes = await authApi.get("/weekly/champions");
      setChampions(championsRes.data);

      // 이제 state에 저장된 loggedInUser를 기준으로 참여 여부를 확인합니다.
      if (loggedInUser) {
        const statusRes = await authApi.get("/weekly/status");
        setHasParticipated(statusRes.data.hasParticipated);
      } else {
        setHasParticipated(false);
      }
    } catch (error) {
      console.error("주간 랭킹 데이터 로딩 실패:", error);
      setChampions({});
    } finally {
      setIsLoading(false);
    }
  };

  // [수정] 이제 이 useEffect는 loggedInUser 'state'가 실제로 변경될 때만 fetchData를 호출하여 무한 루프를 방지합니다.
  useEffect(() => {
    fetchData();
  }, [loggedInUser]);

  const handleJoinChallenge = async () => {
    if (!isAuthenticated()) {
      alert("로그인 후 참여할 수 있습니다.");
      navigate("/login");
      return;
    }

    const ageGroupInput = prompt(
      "연령대를 선택해주세요:\n10: 10대\n20: 20대\n30: 30대\n40: 40대 이상",
      "20"
    );
    if (ageGroupInput === null) {
      return;
    }
    const ageGroup = parseInt(ageGroupInput, 10);

    if (![10, 20, 30, 40].includes(ageGroup)) {
      alert("올바른 연령대를 선택해주세요.");
      return;
    }

    try {
      await authApi.post("/weekly/participate", { ageGroup: ageGroup });
      alert("주간 챌린지에 참여하셨습니다!");

      const participantInfo = {
        nickname: loggedInUser.nickname || "참가자",
        bmi: loggedInUser.bmi || 0,
        goalWeight: loggedInUser.goalWeight || 0,
        ageGroup: ageGroup,
      };
      setChampions((prevChampions) => ({
        ...prevChampions,
        [ageGroup]: participantInfo,
      }));
      setHasParticipated(true);
    } catch (error) {
      console.error("챌린지 참여 실패:", error);
      const errorMessage =
        error.response?.data?.message || "챌린지 참여 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const handleCancelChallenge = async () => {
    if (window.confirm("정말 참여를 취소하시겠습니까?")) {
      try {
        await authApi.delete("/weekly/participate");
        alert("참여가 취소되었습니다.");
        await fetchData();
      } catch (error) {
        console.error("참여 취소 실패:", error);
        alert("참여 취소 중 오류가 발생했습니다.");
      }
    }
  };

  // ChampionCard 컴포넌트 (변경 없음)
  const ChampionCard = ({ champion }) => {
    if (!champion) {
      return (
        <div className={styles.best}>
          주간MVP에
          <br />
          참여하세요
        </div>
      );
    }
    return (
      <div className={styles.best}>
        {champion.nickname} <br />
        BMI: {champion.bmi}%  목표 {champion.goalWeight}kg <br />
        {champion.ageGroup}대
      </div>
    );
  };

  // return 렌더링 부분 (변경 없음)
  return (
    <div className={styles.container}>
      <div className={styles.cheer}>
        회원님의 목표체중을 위한 실천을 응원합니다!
      </div>
      <div className={styles.bestline}>
        <div className={styles.bestbox}>
          {isLoading ? (
            <div className={styles.loadingMessage}>
              주간 MVP를 불러오는 중...
            </div>
          ) : (
            <>
              {ageGroups.map((age) => (
                <ChampionCard key={age} champion={champions[age]} />
              ))}
              <div className={styles.best_btnbox}>
                {loggedInUser && hasParticipated ? (
                  <button
                    className={styles.btn_cancel}
                    onClick={handleCancelChallenge}
                  >
                    참여 취소
                  </button>
                ) : (
                  <JoinButton onClick={handleJoinChallenge} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
