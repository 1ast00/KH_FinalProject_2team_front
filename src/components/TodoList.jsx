import React from 'react';
import { useTodoStore } from '../store/todoStore';
// ⚠️ 주의: selector에서 객체/배열을 만들면 렌더마다 참조가 달라져 무한 리렌더 위험
// 가장 안전한 방법: 필요한 값을 "각각" 구독하세요.

export default function TodoList() {
  // ✅ 각 값 개별 구독 패턴 (권장)
  const todos = useTodoStore((s) => s.todos);
  const toggle = useTodoStore((s) => s.toggle);
  const remove = useTodoStore((s) => s.remove);
  const clearDone = useTodoStore((s) => s.clearDone);

  // 파생 값은 상태에 저장하지 말고 selector로 계산하세요.
  const remaining = useTodoStore((s) => s.todos.filter((t) => !t.done).length);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <strong>남은 일: {remaining}</strong>
        <button onClick={clearDone} style={{ marginLeft: 'auto' }}>
          완료 비우기
        </button>
      </div>

      <ul style={{ paddingLeft: 16 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
            </label>
            <button onClick={() => remove(t.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
