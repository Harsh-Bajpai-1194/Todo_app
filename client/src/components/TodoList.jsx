import React, { useContext, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TodoContext } from '../context/TodoContext';
import { AuthContext } from '../context/AuthContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { filteredTodos, getTodos, onDragEnd, filterStatus, searchTerm } = useContext(TodoContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      getTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const isDragDisabled = filterStatus !== 'all' || searchTerm !== '';

  if (!filteredTodos || filteredTodos.length === 0) {
    return <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">No tasks found. Add one above!</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {filteredTodos.map((todo, index) => (
              <Draggable key={todo._id} draggableId={todo._id} index={index} isDragDisabled={isDragDisabled}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${isDragDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-grab'} ${
                      snapshot.isDragging ? 'shadow-lg' : ''
                    }`}
                  >
                    <TodoItem todo={todo} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;