import React, { useEffect, useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';
import { getUserData } from "../service/authApi";
import { isAuthenticated } from "../util/authUtil";
import styles from '../css/TodoList.module.css';

export default ({ selectedDate }) => {
  const { loadInitial, clearDone, todos, doneTodos} = useTodoStore();
  const updateChk = useTodoStore((s) => s.updateChk);
  const [currentUser, setCurrentUser] = useState({});
  const [resPonseMsg, setResPonseMsg] = useState("");
  

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

  // list 항목 불러옴
  useEffect(() => {
    (async () => {
      await loadInitial(selectedDate);
      console.log(loadInitial);
    })(); 
  }, [selectedDate, currentUser]); // 변경될 때마다 이 훅이 실행됨

  // 변경 사항 저장
  const handleUpdateChk = async () => {
    try {
      const response = await updateChk();   
      setResPonseMsg(response?.msg || "변경 사항 저장을 완료했습니다.");
    } catch (error) {
      setResPonseMsg("변경 사항 저장을 실패했습니다.");
    }
  };

  // 완료 항목 삭제
  const handleAllRemoveClick = async () => {
    try {
      const response = await clearDone(doneTodos);
      setResPonseMsg(response?.msg || "완료 항목 일괄 삭제가 완료되었습니다.");
    } catch (error) {
      setResPonseMsg("완료 항목 일괄 삭제를 실패했습니다.")
    }
  };

  return (
    <div className={styles.todoContainer}>
      <div className={styles.todoActions}>
        <span>{resPonseMsg}</span>
        <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={handleUpdateChk}>변경 사항 저장</button>
        <button className={`${styles.actionBtn} ${styles.clearBtn}`} onClick={handleAllRemoveClick}>
          완료 항목 삭제
        </button>
      </div>

      {/* 미완료 할 일 섹션 */}
      <div className={styles.todoListContainer}>
        {todos.length > 0 && (
          <>
            <h4 className={`${styles.sectionHeader} ${styles.pending}`}>오늘의 할 일</h4>
            <ul className={styles.todoList}>
              {todos.map((t) => (
                <TodoItem key={t.id} todo={t} />
              ))}
            </ul>
          </>
        )}

        {/* 완료된 할 일 섹션 */}
        {doneTodos.length > 0 && (
          <>
            <h4 className={`${styles.sectionHeader} ${styles.completed}`}>완료된 할 일</h4>
            <ul className={styles.todoList}>
              {doneTodos.map((t) => (
                <TodoItem key={t.id} todo={t} />
              ))}
            </ul>
          </>
        )}

        {todos.length === 0 && (
          <div className={styles.emptyMessage}>
            할 일을 추가해 보세요!
          </div>
        )}
      </div>
    </div>
  );
}