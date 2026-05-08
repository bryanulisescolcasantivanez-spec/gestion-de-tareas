import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import './App.css';

function App() {
  // Ahora extraemos también filter y setFilter
  const { tasks, filter, setFilter, addTask, toggleTaskStatus, deleteTask, getStats } = useTasks();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');
  
  // PASO A: El estado del buscador (Tu responsabilidad)
  const [searchTerm, setSearchTerm] = useState('');

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

      {/* PASO B: El Input del Buscador (Tu responsabilidad) */}
      <section className="search-bar">
        <input 
          type="text" 
          placeholder="🔍 Buscar tarea por nombre..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
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

      
      <div className="filters">
        <button 
          className={filter === 'todas' ? 'active' : ''}
          onClick={() => setFilter('todas')}
        >
          Todas
        </button>
        <button 
          className={filter === 'pendientes' ? 'active' : ''}
          onClick={() => setFilter('pendientes')}
        >
          Pendientes
        </button>
        <button 
          className={filter === 'completadas' ? 'active' : ''}
          onClick={() => setFilter('completadas')}
        >
          Completadas
        </button>
      </div>

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