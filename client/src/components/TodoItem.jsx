import React, { useContext } from 'react';
import TodoContext from '../context/TodoContext';

const TodoItem = ({ todo }) => {
  const todoContext = useContext(TodoContext);
  const { deleteTodo, setCurrent, clearCurrent, updateTodo } = todoContext;

  const { _id, task, time, completed } = todo;

  const onDelete = () => {
    deleteTodo(_id);
    clearCurrent();
  };

  const onToggle = () => {
    updateTodo({ ...todo, completed: !completed });
  };

  return (
    <div className={`bg-white p-4 rounded shadow mb-3 flex justify-between items-center ${completed ? 'opacity-60' : ''}`}>
      <div>
        <h3 className={`text-lg font-semibold ${completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task}
        </h3>
        {time && <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{time}</span>}
      </div>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded text-sm text-white ${completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
          onClick={onToggle}
        >
          {completed ? 'Undo' : 'Done'}
        </button>
        <button
          className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
          onClick={() => setCurrent(todo)}
        >
          Edit
        </button>
        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;