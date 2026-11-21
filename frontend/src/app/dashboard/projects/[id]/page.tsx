'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, createTask, updateTask, deleteTask, Task } from '@/store/taskSlice';
import api from '@/lib/api';

const COLUMNS: { key: Task['status']; label: string; color: string; bg: string; dot: string }[] = [
  { key: 'todo', label: 'To Do', color: 'text-gray-600', bg: 'bg-gray-50', dot: 'bg-gray-400' },
  { key: 'in-progress', label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  { key: 'done', label: 'Done', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items: tasks, loading } = useAppSelector(s => s.tasks);
  const [project, setProject] = useState<{ title: string; description: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDue, setFilterDue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo' as Task['status'], dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => setProject(r.data)).catch(() => router.push('/dashboard/projects'));
    dispatch(fetchTasks({ projectId: id }));
  }, [id, dispatch, router]);

  const filtered = tasks.filter(t => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterDue && t.dueDate && new Date(t.dueDate) > new Date(filterDue)) return false;
    return true;
  });

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: '', description: '', status: 'todo', dueDate: '' });
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description, status: task.status, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (editTask) {
      await dispatch(updateTask({ projectId: id, taskId: editTask._id, data: form }));
    } else {
      await dispatch(createTask({ projectId: id, data: form }));
    }
    setShowModal(false);
    setSubmitting(false);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Delete this task?')) dispatch(deleteTask({ projectId: id, taskId }));
  };

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    dispatch(updateTask({ projectId: id, taskId: task._id, data: { status: newStatus } }));
  };

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  const isOverdue = (d?: string) => d && new Date(d) < new Date() ? true : false;

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => router.push('/dashboard/projects')} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project?.title || 'Loading...'}</h1>
          {project?.description && <p className="text-gray-500 text-sm mt-0.5">{project.description}</p>}
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 mt-4">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-gray-600">
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          type="date"
          value={filterDue}
          onChange={e => setFilterDue(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-gray-600"
          title="Filter by due date (show tasks due on or before)"
        />
        {(filterStatus || filterDue) && (
          <button onClick={() => { setFilterStatus(''); setFilterDue(''); }} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            Clear filters
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          {COLUMNS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.key);
            return (
              <div key={col.key} className="flex flex-col">
                <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${col.bg} mb-3`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <span className={`font-semibold text-sm ${col.color}`}>{col.label}</span>
                  <span className={`ml-auto text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${col.bg === 'bg-gray-50' ? 'bg-gray-200 text-gray-600' : col.bg === 'bg-amber-50' ? 'bg-amber-200 text-amber-700' : 'bg-green-200 text-green-700'}`}>{colTasks.length}</span>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {colTasks.map(task => (
                    <div key={task._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => openEdit(task)} className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(task._id)} className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {task.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>}

                      <div className="flex items-center justify-between mt-3">
                        {task.dueDate ? (
                          <span className={`text-xs flex items-center gap-1 ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-500' : 'text-gray-400'}`}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(task.dueDate)}
                          </span>
                        ) : <span />}

                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task, e.target.value as Task['status'])}
                          onClick={e => e.stopPropagation()}
                          className="text-xs border border-gray-100 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-400 bg-gray-50 text-gray-600 cursor-pointer"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center">
                      <p className="text-xs text-gray-300">No tasks here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">{editTask ? 'Edit Task' : 'Add New Task'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Task Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="What needs to be done?" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Add more details..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Task['status'] })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium disabled:opacity-60">
                  {submitting ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
