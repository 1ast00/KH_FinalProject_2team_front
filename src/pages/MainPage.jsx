import { isAuthenticated } from "../util/authUtil";
import { Link } from "react-router-dom";
import styles from "../css/Main.module.css";
import { useEffect, useState } from "react";
import { getUserData } from "../service/authApi";

export default () => {
  
  const [currentUser, setCurrentUser] = useState({});

  // icon 3 번 출력
  const icons = [1, 2, 3];
  
  // 회원 정보 불러오는 api
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated()) {
        const user = await getUserData(); // 서버에 다시 요청
        setCurrentUser(user);
        console.log(user);
      }
    };
    fetchUserData();
  }, []); 

  return (
    <div className={styles.container}>
      <div className={styles.headerImage}>
        <img src="/img/main_1.png" alt="main 이미지"/>
      </div>
      <div className={styles.mainImage}>
        <img src="/img/main_2.png" alt="main 이미지" />
      </div>
      
      {/* 유효성 검사 */}
      {
        isAuthenticated() ? (
          <div className={styles.authenticatedContent}>
            {/* 닉네임, 목표 체중 */}
            <div className={styles.welcomeSection}>
              <img src="/img/main_icon_1.png" alt="main icon 1" className={styles.icon}/>
              <h3 className={styles.welcomeTitle}>안녕하세요, <span className={styles.nickname}>{currentUser.nickname}</span> 님!</h3>
              <p className={styles.welcomeText}>오늘도 건강한 하루를 시작해 보세요!</p>
              <p className={styles.welcomeText}>충분한 수분 섭취와 규칙적인 운동으로 활기찬 하루를 만들어 보세요.</p>
              <p className={styles.goalText}>목표 체중까지 <span className={styles.goalweight}>{currentUser.weight - currentUser.goalweight}</span> kg 남았습니다.</p>
              
              <div className={styles.iconRow}>
                {icons.map((_, index) => (
                  <img key={index} src="/img/main_icon_2.png" alt="main icon 2" />
                ))}
              </div>
            </div>

            {/* TodoList */}
            <Link to="/todoList" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.section}>
                <img src="/img/main_icon_3.png"alt="main todoList icon" className={styles.sectionIcon}/>
                <h3 className={styles.sectionTitle}>TodoList</h3>
              </div>
            </Link>

            {/* 추천 메뉴 */}
            <div className={styles.section}>
              <img src="/img/main_icon_4.png" alt="main recipe icon" className={styles.sectionIcon}/>
              <h3 className={styles.sectionTitle}>추천 메뉴</h3>
            </div>
          </div>
        ) : (
          <div className={styles.nonAuthenticatedContent}>
            {/* 해당 이미지 클릭 시 회원가입 페이지로 이동 */}
            <Link to="/register" className={styles.introLink}>
              <img src="/img/main_3(non-member).png" alt="소개 이미지" className={styles.introImage}/>
            </Link>

            <div className={styles.featuresGrid}>
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>건강 일지</h3>
                  <p className={styles.featureText}>현재 <span className={styles.writeMember}>{}</span>명의 회원이 <br />건강 일지를 작성하고 있습니다.</p>
                </div>
              </Link>
              <Link to="/exercise" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>추천 운동</h3>
                  <p className={styles.featureText}>운동의 칼로리를 지금 확인해 보세요.</p>
                </div>
              </Link>
              <Link to="/food/search" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>식품</h3>
                  <p className={styles.featureText}>음식의 영양 성분을 확인해 보세요.</p>
                </div>
              </Link>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>다이어트 간단 플랜</h3>
                <p className={styles.featureText}>간단한 다이어트 플랜을 받아보세요.</p>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};