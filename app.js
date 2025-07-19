document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('todo-input1');
    const input2 = document.getElementById('todo-input2');
    const addBtn1 = document.getElementById('add-btn1');
    const addBtn2 = document.getElementById('add-btn2');
    const todoList = document.getElementById('todo-list');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Render existing todos
    todos.forEach(todo => renderTodo(todo));

    addBtn.addEventListener('click', addTodo);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    function addTodo() {
        const text = input.value.trim();
        if (text === '') return;
        const todo = { text, completed: false };
        todos.push(todo);
        saveTodos();
        renderTodo(todo);
        input.value = '';
    }

    function renderTodo(todo) {
        const li = document.createElement('li');
        li.textContent = todo.text;
        if (todo.completed) {
            li.classList.add('completed');
        }

        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔️';
        completeBtn.style.marginRight = '8px';
        completeBtn.onclick = () => {
            todo.completed = !todo.completed;
            saveTodos();
            li.classList.toggle('completed');
        };

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => {
            todos = todos.filter(t => t !== todo);
            saveTodos();
            li.remove();
        };

        li.prepend(completeBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});
