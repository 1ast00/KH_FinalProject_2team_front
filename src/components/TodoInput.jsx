import React, { useState } from 'react';
import { useTodoStore } from '../store/todoStore';
import styles from '../css/TodoList.module.css';

export default ({ selectedDate, setSelectedDate }) => {
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
      <div className={styles.todoHeader}>
        <img src="/img/todoList.png" alt="todoList" />
      </div>
      <div className={styles.todoContainer}>
        <h3 className={styles.todoTitle}>오늘의 할 일</h3>
        <div>
          <form onSubmit={onSubmit} className={styles.todoInputForm}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="오늘의 목표를 작성해 보세요." />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <button type="submit">+</button>
          </form>
        </div>
      </div>
    </div>
  );
}