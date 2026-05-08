import { useState } from 'react';
import { useTasks, FilterType } from './hooks/useTasks';
import './App.css';

function App() {
  // Ahora extraemos también filter y setFilter
  const { tasks, filter, setFilter, addTask, toggleTaskStatus, deleteTask, getStats } = useTasks();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');
  const stats = getStats();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() === '') return;
    addTask(taskTitle, taskPriority);
    setTaskTitle('');
  };

  return (
    <div className="app-container">
      <h1>Gestión de Tareas</h1>

      <section className="dashboard">
        <p>Total: {stats.total}</p>
        <p>Completadas: {stats.completed}</p>
        <p>Urgentes: {stats.urgent}</p>
        <p>Progreso: {stats.progress}%</p>
      </section>

      <form onSubmit={handleSubmit} className="task-form">
        <input 
          type="text" 
          placeholder="¿Qué necesitas hacer?" 
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <select 
          value={taskPriority} 
          onChange={(e) => setTaskPriority(e.target.value as 'alta' | 'media' | 'baja')}
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button type="submit">Agregar Tarea</button>
      </form>

      {/* --- BOTONES DE FILTRO --- */}
      <div className="filters">
        <button 
          style={{ fontWeight: filter === 'todas' ? 'bold' : 'normal' }}
          onClick={() => setFilter('todas')}
        >
          Todas
        </button>
        <button 
          style={{ fontWeight: filter === 'pendientes' ? 'bold' : 'normal' }}
          onClick={() => setFilter('pendientes')}
        >
          Pendientes
        </button>
        <button 
          style={{ fontWeight: filter === 'completadas' ? 'bold' : 'normal' }}
          onClick={() => setFilter('completadas')}
        >
          Completadas
        </button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <span>[{task.priority.toUpperCase()}] {task.title}</span>
            <button onClick={() => toggleTaskStatus(task.id)}>
              {task.completed ? 'Deshacer' : 'Completar'}
            </button>
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;