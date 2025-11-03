import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';
import '../../styles/todo.scss';

type Props = {
  todo: TodoType;
  onDeleteTodo: (id: number) => void;
  deletingIds: number[];
  onUpdateTodo: (id: number, updatedTodo: Partial<TodoType>) => void;
  updatingIds?: number[];
  editingId: number | null;
  setEditingId: (id: number | null) => void;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  deletingIds,
  onUpdateTodo,
  updatingIds,
  editingId,
  setEditingId,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = editingId === todo.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const handleSubmit = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      onDeleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    try {
      if (onUpdateTodo) {
        await onUpdateTodo(todo.id, { title: trimmedTitle });
        setEditingId(null);
      } else {
        setEditingId(null);
      }
    } catch (error) {}
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setEditingId(null);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed === true })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            onUpdateTodo?.(todo.id, { completed: !todo.completed })
          }
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={event => setEditedTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingId(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            deletingIds.includes(todo.id) || updatingIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
