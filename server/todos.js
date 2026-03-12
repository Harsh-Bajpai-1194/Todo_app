const express = require('express');
const router = express.Router();
const { middleware } = require('./auth');
const Todo = require('./Todo');

// @route    GET api/todos
// @desc     Get all user's todos
// @access   Private
router.get('/', middleware, async (req, res) => {
    try {
        // Find todos by the user id and sort by the custom order
        const todos = await Todo.find({ user: req.user.id }).sort({ order: 'asc' });
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
    const io = req.app.get('socketio');

    try {
        // Find the highest current order value to ensure the new todo is added to the end.
        const lastTodo = await Todo.findOne({ user: req.user.id }).sort({ order: -1 });
        const newOrder = lastTodo ? lastTodo.order + 1 : 0;

        const newTodo = new Todo({
            task,
            time,
            completed,
            user: req.user.id,
            order: newOrder,
        });

        const todo = await newTodo.save();

        // Emit event to all clients in the user's room that a new todo was created
        io.to(req.user.id).emit('todo:created', todo);
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/todos/reorder
// @desc     Reorder todos
// @access   Private
router.put('/reorder', middleware, async (req, res) => {
    const { orderedIds } = req.body;
    const io = req.app.get('socketio');

    if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ msg: 'Invalid request body, expected orderedIds array.' });
    }

    try {
        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id, user: req.user.id },
                update: { $set: { order: index } }
            }
        }));

        if (bulkOps.length > 0) await Todo.bulkWrite(bulkOps);

        // Notify clients that a reorder happened so they can refetch
        io.to(req.user.id).emit('todos:reordered');

        res.json({ msg: 'Todos reordered successfully' });
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
    const io = req.app.get('socketio');

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

        // Emit event that a todo was updated
        io.to(req.user.id).emit('todo:updated', todo);

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
    const io = req.app.get('socketio');
    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Make sure user owns todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Todo.findByIdAndDelete(req.params.id);

        // Emit event that a todo was deleted
        io.to(req.user.id).emit('todo:deleted', req.params.id);

        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
