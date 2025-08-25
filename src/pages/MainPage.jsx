import { isAuthenticated } from "../util/authUtil";

export default () => {
  // 소개 이미지 클릭 시
  const startRegister = () => {

  };
  
  return (
    <div>
      <img src="/img/main_1.png" alt="main 이미지"/>
      <br />
      <img src="/img/main_2.png" alt="main 이미지" />
    
      {/* 유효성 검사 */}
      {
        isAuthenticated() ? (
          <div>
           
          </div>
        ) : (
          <div>
            <img src="/img/main_3(non-member).png" alt="소개 이미지" />
          </div>
        )
      }
    </div>
  );
};