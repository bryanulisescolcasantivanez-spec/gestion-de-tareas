import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  createdAt: string; // Aquí guardaremos fecha y hora
}

export type FilterType = 'todas' | 'pendientes' | 'completadas';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState<FilterType>('todas');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      completed: false,
      // Registra fecha y hora exacta en formato legible
      createdAt: new Date().toLocaleString('es-PE', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    };
    setTasks(prev => [newTask, ...prev]); // Las nuevas aparecen primero
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

  // --- LÓGICA DE FILTRADO + BUSCADOR ---
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'todas' ? true : 
      filter === 'pendientes' ? !task.completed : task.completed;
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return { 
    tasks: filteredTasks, 
    filter, 
    setFilter, 
    searchTerm, 
    setSearchTerm, 
    addTask, 
    toggleTaskStatus, 
    deleteTask, 
    getStats 
  };
};