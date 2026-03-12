const express = require('express');
const router = express.Router();
const { middleware } = require('./auth');
const Todo = require('./Todo');

// @route    GET api/todos
// @desc     Get all user's todos
// @access   Private
router.get('/', middleware, async (req, res) => {
    try {
        // Find todos by the user id from the auth middleware and sort by the most recent
        const todos = await Todo.find({ user: req.user.id }).sort({ date: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/todos
// @desc     Add new todo
// @access   Private
router.post('/', middleware, async (req, res) => {
    const { task, time, completed } = req.body;

    try {
        const newTodo = new Todo({
            task,
            time,
            completed,
            user: req.user.id
        });

        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/todos/:id
// @desc     Update todo
// @access   Private
router.put('/:id', middleware, async (req, res) => {
    const { task, time, completed } = req.body;

    // Build todo object
    const todoFields = {};
    if (task) todoFields.task = task;
    if (time) todoFields.time = time;
    if (completed !== undefined) todoFields.completed = completed;

    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Make sure user owns todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        todo = await Todo.findByIdAndUpdate(req.params.id, { $set: todoFields }, { returnDocument: 'after' });

        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/todos/:id
// @desc     Delete todo
// @access   Private
router.delete('/:id', middleware, async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Make sure user owns todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Todo.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
