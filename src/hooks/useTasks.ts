import { useState, useEffect } from 'react';

// Definición de la estructura de una tarea
export interface Task {
  id: string;
  title: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  createdAt: string; 
}

export type FilterType = 'todas' | 'pendientes' | 'completadas';

export const useTasks = () => {
  // Cargar tareas del LocalStorage al iniciar
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<FilterType>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Guardar en LocalStorage cada vez que cambien las tareas
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      completed: false,
      // Registro de Fecha y Hora local
      createdAt: new Date().toLocaleString('es-PE', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const urgent = tasks.filter(t => !t.completed && t.priority === 'alta').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, urgent, progress };
  };

  // Lógica combinada de Filtros + Buscador
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'todas' ? true : 
      filter === 'pendientes' ? !task.completed : task.completed;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return { 
    tasks: filteredTasks, filter, setFilter, searchTerm, setSearchTerm, 
    addTask, toggleTaskStatus, deleteTask, getStats 
  };
};