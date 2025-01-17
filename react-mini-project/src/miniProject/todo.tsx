import React, { useCallback, useMemo, useRef, useState } from 'react';
import './Todo.css';

// 할 일 항목의 구조를 정의하는 인터페이스
interface TodoItem {
  id: number;         // 할 일의 고유 ID
  text: string;       // 할 일의 내용
  completed: boolean; // 할 일 완료 여부
}

// Todo 컴포넌트
export default function Todo() {
  // 할 일 목록 상태를 관리
  const [todos, setTodos] = useState<TodoItem[]>([]);
  
  // 필터 상태 관리 ('all', 'active', 'completed')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // 다음에 추가할 항목의 ID를 추적 (렌더링 간 유지)
  const nextIdRef = useRef(0);

  // 새로운 할 일을 추가하는 함수
  const addTodo = useCallback((text: string) => {
    setTodos(todos => [
      ...todos, // 기존 할 일 유지
      { id: nextIdRef.current++, text, completed: false } // 새로운 항목 추가
    ]);
  }, []);

  // 특정 할 일의 완료 상태를 토글하는 함수
  const toggleTodo = useCallback((id: number) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed } // 완료 상태 반전
          : todo // 나머지는 그대로 유지
      )
    );
  }, []);

  // 특정 할 일을 삭제하는 함수
  const deleteTodo = useCallback((id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id)); // 해당 ID 제외
  }, []);

  // 현재 필터 상태에 따라 할 일을 필터링
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'all': // 전체 항목 반환
        return todos;
      case 'active': // 완료되지 않은 항목만 반환
        return todos.filter(todo => !todo.completed);
      case 'completed': // 완료된 항목만 반환
        return todos.filter(todo => todo.completed);
      default:
        throw new Error('Unknown filter: ' + filter); // 예외 처리
    }
  }, [todos, filter]); // todos와 filter가 변경될 때만 계산

  // 입력 필드에서 Enter 키를 눌렀을 때 처리
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // Enter 키인지 확인
      const input = e.target as HTMLInputElement;
      if (input.value.trim() !== '') { // 입력 값이 공백이 아닌지 확인
        addTodo(input.value.trim()); // 새로운 할 일 추가
        input.value = ''; // 입력 필드 초기화
      }
    }
  };

  // 렌더링 결과
  return (
    <div className="app-container">
      {/* 제목 */}
      <h2>Todo List</h2>

      {/* 새로운 할 일 입력 필드 */}
      <input
        type="text"
        className="todo-input"
        placeholder="Add a new task"
        onKeyDown={handleInputKeyDown} // Enter 키 입력 처리
      />

      {/* 필터 버튼들 */}
      <div className="buttons-container">
        <button onClick={() => setFilter('all')}>All</button> {/* 전체 보기 */}
        <button onClick={() => setFilter('active')}>Active</button> {/* 완료되지 않은 항목 보기 */}
        <button onClick={() => setFilter('completed')}>Completed</button> {/* 완료된 항목 보기 */}
      </div>

      {/* 필터링된 할 일 목록 */}
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            {/* 할 일 내용 */}
            <span
              className={`todo-text ${todo.completed ? 'completed' : ''}`} // 완료된 항목 스타일 적용
              onClick={() => toggleTodo(todo.id)} // 클릭 시 완료 상태 토글
            >
              {todo.text}
            </span>
            {/* 삭제 버튼 */}
            <button
              onClick={() => deleteTodo(todo.id)} // 클릭 시 항목 삭제
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
