import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  visibleTodos: TodoType[];
  tempTodo: TodoType | null;
  onDeleteTodo: (id: number) => void;
  deletingIds: number[];
  updatingIds: number[];
  onUpdateTodo: (id: number, updatedTodo: Partial<TodoType>) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  onDeleteTodo,
  deletingIds,
  updatingIds,
  onUpdateTodo,
  editingId,
  setEditingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          deletingIds={deletingIds}
          updatingIds={updatingIds}
          onUpdateTodo={onUpdateTodo}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          deletingIds={[0]}
          updatingIds={[]}
          editingId={null}
          setEditingId={setEditingId}
        />
      )}
    </section>
  );
};
