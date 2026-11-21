const Task = require('../models/Task');
const Project = require('../models/Project');

const verifyProjectOwner = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  return !!project;
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!(await verifyProjectOwner(projectId, req.user._id)))
      return res.status(403).json({ message: 'Forbidden' });

    const filter = { project: projectId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.dueDate) filter.dueDate = { $lte: new Date(req.query.dueDate) };

    const tasks = await Task.find(filter).sort('dueDate');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!(await verifyProjectOwner(projectId, req.user._id)))
      return res.status(403).json({ message: 'Forbidden' });

    const { title, description, status, dueDate } = req.body;
    const task = await Task.create({ title, description, status, dueDate, project: projectId, owner: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
