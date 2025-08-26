import React, { useState } from 'react';
import { useTodoStore } from '../store/todoStore';

export default function TodoItem({ todo }) {
  const { toggle, remove, edit } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  // 수정 버튼 클릭 시
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 수정 완료 버튼 클릭 시
  const handleSaveClick = () => {
    edit(todo.id, newTitle);
    setIsEditing(false);
  };

  // 삭제 버튼 클릭 시
  const handleRemoveClick = () => {
    remove(todo.id);
  };

  // 엔터 키 입력 시 수정 완료
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    }
  };

  return (
    <li key={todo.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
        <input type="checkbox" checked={todo.done} onChange={() => toggle(todo.id)} />
        
        {/* 수정 모드에 따라 <span> 또는 <input> 렌더링 */}
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSaveClick} // 포커스를 잃으면 저장
            onKeyPress={handleKeyPress}
            autoFocus
          />
        ) : (
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.title}
          </span>
        )}
      </label>
      
      {/* 수정 모드에 따라 버튼 변경 */}
      {isEditing ? (
        <button onClick={handleSaveClick}>저장</button>
      ) : (
        <button onClick={handleEditClick}>수정</button>
      )}
      
      <button onClick={handleRemoveClick}>삭제</button>
    </li>
  );
}