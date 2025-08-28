import React, { useEffect, useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';
import { getTodosByDate } from '../service/todoApi';
import { getUserData } from "../service/authApi";
import { isAuthenticated } from "../util/authUtil";
import styles from '../css/TodoList.module.css';

export default ({ selectedDate }) => {
  const { loadInitial, clearDone, todos, doneTodos} = useTodoStore();
  const updateChk = useTodoStore((s) => s.updateChk);
  const [currentUser, setCurrentUser] = useState({});

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

  const handleAllRemoveClick = () => {
    clearDone(doneTodos)
  };

  return (
    <div className={styles.todoContainer}>
      <div className={styles.todoActions}>
        <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={updateChk}>변경 사항 저장</button>
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
            할 일을 추가해보세요!
          </div>
        )}
      </div>
    </div>
  );
}