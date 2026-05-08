import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import './App.css'; // Aquí tu UI/UX Designer pondrá la magia visual

function App() {
  // 1. Extraemos tu lógica impecable del Custom Hook
  const { tasks, addTask, toggleTaskStatus, deleteTask, getStats } = useTasks();

  // 2. Estado local solo para capturar lo que el usuario escribe en el input
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');

  // 3. Extraemos las estadísticas para el Dashboard
  const stats = getStats();

  // 4. Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (taskTitle.trim() === '') return; // Validación básica

    addTask(taskTitle, taskPriority);
    setTaskTitle(''); // Limpiamos el input después de guardar
  };

  return (
    <div className="app-container">
      <h1>Gestión de Tareas</h1>

      {/* --- DASHBOARD DE ESTADÍSTICAS --- */}
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
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <span>[{task.priority.toUpperCase()}] {task.title}</span>
            
            <button onClick={() => toggleTaskStatus(task.id)}>
              {task.completed ? 'Deshacer' : 'Completar'}
            </button>
            
            <button onClick={() => deleteTask(task.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;