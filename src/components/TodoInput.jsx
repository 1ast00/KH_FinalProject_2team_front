import React, { useState } from 'react';
import { useTodoStore } from '../store/todoStore';

export default function TodoInput({ selectedDate, setSelectedDate }) {
  const add = useTodoStore((s) => s.add);
  const [title, setTitle] = useState('');
  
  const onSubmit = (e) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) return;
    add(v, selectedDate);
    setTitle('');
  };

  return (
    <div>
      <div>
        <img src="/img/todoList.png" alt="todoList" />
      </div>
      <h3>오늘의 할 일</h3>
      <div>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="오늘의 목표를 작성해 보세요." />
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <button type="submit">+</button>
        </form>
    </div>
    </div>
  );
}