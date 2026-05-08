import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import './App.css';

function App() {
  const { 
    tasks, filter, setFilter, searchTerm, setSearchTerm, 
    addTask, toggleTaskStatus, deleteTask, getStats 
  } = useTasks();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');
  
  // --- LÓGICA DE TEMA (Oscuro / Claro) ---
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const stats = getStats();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() === '') return;
    addTask(taskTitle, taskPriority);
    setTaskTitle('');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Gestión de Tareas</h1>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </header>

      {/* --- DASHBOARD --- */}
      <section className="dashboard">
        <div className="stat-card"><span>Total</span> <strong>{stats.total}</strong></div>
        <div className="stat-card"><span>Progreso</span> <strong>{stats.progress}%</strong></div>
        <div className="stat-card urgent"><span>Urgentes</span> <strong>{stats.urgent}</strong></div>
      </section>

      {/* --- BUSCADOR --- */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="🔍 Buscar tarea..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- FORMULARIO --- */}
      <form onSubmit={handleSubmit} className="task-form">
        <input 
          type="text" placeholder="Nueva tarea..." 
          value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}
        />
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button type="submit">Añadir</button>
      </form>

      {/* --- FILTROS --- */}
      <nav className="filters">
        {(['todas', 'pendientes', 'completadas'] as const).map(f => (
          <button 
            key={f} 
            className={filter === f ? 'active' : ''} 
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </nav>

      {/* --- LISTA --- */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.priority}`}>
            <div className="task-info">
              <span className={`status-dot ${task.completed ? 'done' : ''}`} 
                    onClick={() => toggleTaskStatus(task.id)} />
              <div>
                <p className={task.completed ? 'completed-text' : ''}>{task.title}</p>
                <small>Creado: {task.createdAt}</small>
              </div>
            </div>
            <button className="btn-delete" onClick={() => deleteTask(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;