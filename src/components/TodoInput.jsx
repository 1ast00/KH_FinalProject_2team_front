import React, { useState } from 'react';
import { useTodoStore } from '../store/todoStore';

export default function TodoInput() {
  // ✅ add 액션만 구독(다른 값 변경 시 리렌더되지 않음)
  const add = useTodoStore((s) => s.add);
  const [title, setTitle] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const v = title.trim();
    if (!v) return;
    add(v);
    setTitle('');
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="할 일을 입력하세요" />
      <button type="submit">추가</button>
    </form>
  );
}
