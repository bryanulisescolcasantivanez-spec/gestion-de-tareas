import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import './App.css'; // Aquí tu UI/UX Designer pondrá la magia visual

import "./style/style.css"
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
    <div className="app-container">
      <h1>Gestión de Tareas</h1>

      <section className="dashboard">
        <p>Total: {stats.total}</p>
        <p>Completadas: {stats.completed}</p>
        <p>Urgentes: {stats.urgent}</p>
        <p>Progreso: {stats.progress}%</p>
      </section>

      {/* --- FORMULARIO DE CREACIÓN --- */}
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