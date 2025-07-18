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

    addBtn1.addEventListener('click', addTodo);
    addBtn2.addEventListener('click', addTodo);

    input1.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    input2.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    function addTodo() {
    const task = input1.value.trim();
    const time = input2.value.trim();
    if (task === '' && time === '') return;

    const text = time ? `${task} at ${time}` : task;
    const todo = { text, completed: false };
    todos.push(todo);
    saveTodos();
    renderTodo(todo);
    input1.value = '';
    input2.value = '';
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
