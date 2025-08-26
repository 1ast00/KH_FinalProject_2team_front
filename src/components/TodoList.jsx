import React, { useEffect, useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';
import { getTodosByDate } from '../service/todoApi';
import { getUserData } from "../service/authApi";
import { isAuthenticated } from "../util/authUtil";

export default function TodoList({ selectedDate }) {
  const clearDone = useTodoStore((s) => s.clearDone);
  const [filteredTodos, setFilteredTodos] = useState([]);
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
    const fetchTodos = async () => {
      try {
        if (!currentUser) {
          console.log("!currentUser");
          return
        }; // 사용자가 없으면 요청하지 않음

        // 백엔드 API를 호출하여 선택된 날짜의 할 일만 가져옴
        console.log("selectedDate: ", selectedDate);
        const response = await getTodosByDate(selectedDate);
        console.log("TodoList.jsx response: ", response);
        // setFilteredTodos(response.data.map(d => ({
        //   id: d.tno,
        //   title: d.tcontent,
        //   done: d.tcheck,
        //   date: d.tdate
        // })));
        console.log("fetchTodos");
      } catch (error) {
        console.error("Error fetching todos:", error);
        setFilteredTodos([]); // 에러 발생 시 빈 배열로 설정
      }
    };
    fetchTodos();
  }, [selectedDate, currentUser]); // 변경될 때마다 이 훅이 실행됨

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={clearDone} style={{ marginLeft: 'auto' }}>
          완료 항목 삭제
        </button>
      </div>

       <ul style={{ paddingLeft: 16 }}>
        {filteredTodos.map((t) => (
          <TodoItem key={t.id} todo={t} />
        ))}
      </ul>
    </div>
  );
}