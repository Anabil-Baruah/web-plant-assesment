const router = require('express').Router();
const protect = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.use(protect);
router.route('/:projectId/tasks').get(getTasks).post(createTask);
router.route('/:projectId/tasks/:taskId').put(updateTask).delete(deleteTask);

module.exports = router;
