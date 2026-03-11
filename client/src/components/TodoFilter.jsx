import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoFilter = () => {
  const { setSearchTerm, setFilterStatus } = useContext(TodoContext);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <input
        type="text"
        placeholder="Search tasks..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <button onClick={() => setFilterStatus('all')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-blue-600">All</button>
        <button onClick={() => setFilterStatus('pending')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-blue-600">Pending</button>
        <button onClick={() => setFilterStatus('completed')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-blue-600">Completed</button>
      </div>
    </div>
  );
};

export default TodoFilter;