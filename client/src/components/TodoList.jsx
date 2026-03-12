import React, { useContext, useEffect } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import { TodoContext } from '../context/TodoContext';
import { AuthContext } from '../context/AuthContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { filteredTodos, getTodos, onDragEnd } = useContext(TodoContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Fetch todos when the component mounts if a token is present
    if (token) {
      getTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!filteredTodos || filteredTodos.length === 0) {
    return <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">No tasks found. Add one above!</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="todos">
        {(provided) => (
          <div
            className="space-y-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {filteredTodos.map((todo, index) => (
              <Draggable key={todo._id} draggableId={todo._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem todo={todo} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default TodoList;