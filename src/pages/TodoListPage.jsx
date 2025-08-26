import React, { useState, useEffect } from 'react';
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";

// 날짜
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default () => {
    const [selectedDate, setSelectedDate] = useState(getTodayDateString());

    return (
        <div>
            <TodoInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <TodoList selectedDate={selectedDate} />
        </div>
    );
}