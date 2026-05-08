import React, { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import "./style/style.css"; 

function App() {
  const { 
    tasks, filter, setFilter, searchTerm, setSearchTerm, 
    addTask, toggleTaskStatus, deleteTask, getStats 
  } = useTasks();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
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
    <div className="app-container"> {/* Clase de tu CSS */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Gestión de Tareas</h1>
        <button onClick={() => setDarkMode(!darkMode)} style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '8px' }}>
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      {/* Dashboard (Clase de tu CSS) */}
      <section className="dashboard">
        <p>Total: {stats.total}</p>
        <p>Pendientes: {stats.total - stats.completed}</p>
        <p>Urgentes: {stats.urgent}</p>
        <p>Progreso: {stats.progress}%</p>
      </section>

      {/* Buscador (Agregamos estilo básico para que no rompa el diseño) */}
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar tarea..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Formulario (Clase de tu CSS) */}
      <form className="task-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="¿Qué hay que hacer?" 
          value={taskTitle} 
          onChange={(e) => setTaskTitle(e.target.value)} 
        />
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button type="submit">Agregar</button>
      </form>

      {/* Filtros (Estilo rápido para mantener orden) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        {(['todas', 'pendientes', 'completadas'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={{ 
              background: filter === f ? '#007bff' : '#eee', 
              color: filter === f ? 'white' : '#333',
              border: 'none', padding: '5px 15px', borderRadius: '15px', cursor: 'pointer'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista (Clase de tu CSS) */}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id}>
            {/* Usamos data-priority para que tu CSS de los puntitos funcione */}
            <span 
              data-priority={task.priority} 
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              {task.title}
            </span>
            
            <button onClick={() => toggleTaskStatus(task.id)}>
              {task.completed ? 'Deshacer' : 'Listo'}
            </button>
            
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;