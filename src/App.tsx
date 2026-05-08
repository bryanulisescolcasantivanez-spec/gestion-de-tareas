import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import './App.css';
import "./style/style.css";

import "./style/style.css"
function App() {
  const { 
    tasks, filter, setFilter, searchTerm, setSearchTerm, 
    addTask, toggleTaskStatus, deleteTask, getStats 
  } = useTasks();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');
  
  // Lógica de Modo Oscuro integrada
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const stats = getStats();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
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

      {/* BUSCADOR */}
      <input 
        className="search-input"
        type="text" 
        placeholder="Buscar tarea..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* FORMULARIO */}
      <form className="task-input-group" onSubmit={handleSubmit}>
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

      {/* FILTROS */}
      <div className="filter-tabs">
        {(['todas', 'pendientes', 'completadas'] as const).map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* LISTA DE TAREAS */}
      <div className="task-container">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.priority} ${task.completed ? 'is-done' : ''}`}>
            <div className="task-content">
              <input type="checkbox" checked={task.completed} onChange={() => toggleTaskStatus(task.id)} />
              <div>
                <h4>{task.title}</h4>
                <small>{task.createdAt} | Prioridad: {task.priority}</small>
              </div>
            </div>
            <button className="btn-del" onClick={() => deleteTask(task.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;