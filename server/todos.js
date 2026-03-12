const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware/auth');
const {
    getTodos,
    addTodo,
    reorderTodos,
    updateTodo,
    deleteTodo
} = require('./controllers/todoController');

// @route    GET api/todos
// @desc     Get all user's todos
// @access   Private
router.get('/', authMiddleware, getTodos);

// @route    POST api/todos
// @desc     Add new todo
// @access   Private
router.post('/', authMiddleware, addTodo);

// @route    PUT api/todos/reorder
// @desc     Reorder todos
// @access   Private
router.put('/reorder', authMiddleware, reorderTodos);

// @route    PUT api/todos/:id
// @desc     Update todo
// @access   Private
router.put('/:id', authMiddleware, updateTodo);

// @route    DELETE api/todos/:id
// @desc     Delete todo
// @access   Private
router.delete('/:id', authMiddleware, deleteTodo);

module.exports = router;
