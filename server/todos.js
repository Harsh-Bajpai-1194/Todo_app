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

    try {
        // Get the count of existing todos for this user to set the order.
        // This ensures new todos are always added to the end.
        const count = await Todo.countDocuments({ user: req.user.id });

        const newTodo = new Todo({
            task,
            time,
            completed,
            user: req.user.id,
            order: count // New items will have the highest order number
        });

        const todo = await newTodo.save();
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
