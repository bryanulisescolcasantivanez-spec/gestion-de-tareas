import { useState } from 'react';
import { useTasks } from './hooks/useTasks';

import "./style/style.css";

;
function App() {
  // 1. Extraemos tu lógica impecable del Custom Hook
  const { tasks, addTask, toggleTaskStatus, deleteTask, getStats } = useTasks();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');

  // 3. Extraemos las estadísticas para el Dashboard
  const stats = getStats();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (taskTitle.trim() === '') return; // Validación básica

    addTask(taskTitle, taskPriority);
    setTaskTitle('');
  };

  return (
    <div className="main-layout">
      <header className="app-header">
        <h1>Gestor de Tareas AI</h1>
        <button className="btn-theme" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      {/* DASHBOARD */}
      <div className="stats-grid">
        <div className="card"><h3>Total</h3><p>{stats.total}</p></div>
        <div className="card"><h3>Progreso</h3><p>{stats.progress}%</p></div>
        <div className="card urgent"><h3>Urgentes</h3><p>{stats.urgent}</p></div>
      </div>

      {/* --- FORMULARIO DE CREACIÓN --- */}
      <form onSubmit={handleSubmit} className="task-form">
        <input 
          type="text" placeholder="¿Qué hay que hacer?" 
          value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} 
        />
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button type="submit">Añadir</button>
      </form>

      {/* --- LISTA DE TAREAS --- */}
      <ul className="task-list">
        {/* PASO C: Filtrado dinámico (Tu responsabilidad) */}
        {tasks
          .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((task) => (
            <li key={task.id} className={`task-item ${task.priority}`} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              <span>[{task.priority.toUpperCase()}] {task.title}</span>
              <div className="actions">
                <button onClick={() => toggleTaskStatus(task.id)}>
                  {task.completed ? 'Deshacer' : 'Completar'}
                </button>
                <button onClick={() => deleteTask(task.id)}>Eliminar</button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default App;