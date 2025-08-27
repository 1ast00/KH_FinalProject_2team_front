import React, { useEffect, useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';
import { getTodosByDate } from '../service/todoApi';
import { getUserData } from "../service/authApi";
import { isAuthenticated } from "../util/authUtil";

export default function TodoList({ selectedDate }) {
  const loadInitial = useTodoStore((s) => s.loadInitial);
  const clearDone = useTodoStore((s) => s.clearDone);
  const todos = useTodoStore((s) => s.todos);
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

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={updateChk} style={{ marginLeft: 'auto' }}>변경 사항 저장</button>
        <button onClick={clearDone} style={{ marginLeft: 'auto' }}>
          완료 항목 삭제
        </button>
      </div>

       <ul style={{ paddingLeft: 16 }}>
        {todos.map((t) => (
          <TodoItem key={t.id} todo={t} />
        ))}
      </ul>
    </div>
  );
}