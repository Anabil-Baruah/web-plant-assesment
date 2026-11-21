'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects } from '@/store/projectSlice';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Task } from '@/store/taskSlice';

interface TaskWithProject extends Task {
  projectTitle: string;
}

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items: projects } = useAppSelector(s => s.projects);
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  useEffect(() => {
    if (projects.length === 0) return;
    const loadAll = async () => {
      setLoading(true);
      const all: TaskWithProject[] = [];
      for (const p of projects) {
        try {
          const r = await api.get(`/tasks/${p._id}/tasks`);
          r.data.forEach((t: Task) => all.push({ ...t, projectTitle: p.title }));
        } catch {}
      }
      all.sort((a, b) => (a.dueDate || '') > (b.dueDate || '') ? 1 : -1);
      setTasks(all);
      setLoading(false);
    };
    loadAll();
  }, [projects]);

  const filtered = filterStatus ? tasks.filter(t => t.status === filterStatus) : tasks;

  const statusConfig = {
    'todo': { label: 'To Do', className: 'bg-gray-100 text-gray-600' },
    'in-progress': { label: 'In Progress', className: 'bg-amber-100 text-amber-700' },
    'done': { label: 'Done', className: 'bg-green-100 text-green-700' },
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-500 mt-1">View tasks across all your projects</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-gray-600">
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-gray-400">No tasks found. Create a project and add tasks to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">Task</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">Project</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">Due Date</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(task => {
                const sc = statusConfig[task.status];
                const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
                return (
                  <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        {task.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{task.description}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{task.projectTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${sc.className}`}>{sc.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      {task.dueDate ? (
                        <span className={`text-sm ${overdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {overdue && ' (overdue)'}
                        </span>
                      ) : <span className="text-gray-300 text-sm">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => router.push(`/dashboard/projects/${task.project}`)} className="text-xs text-violet-600 hover:underline font-medium">View project</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
