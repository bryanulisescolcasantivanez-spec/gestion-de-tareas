import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  createdAt: string;
}

// Creamos un tipo para los filtros
export type FilterType = 'todas' | 'pendientes' | 'completadas';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Nuevo estado para controlar el filtro actual
  const [filter, setFilter] = useState<FilterType>('todas');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => 
      prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const urgent = tasks.filter(t => !t.completed && t.priority === 'alta').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, urgent, progress };
  };

  // Lógica de filtrado dinámico
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pendientes') return !task.completed;
    if (filter === 'completadas') return task.completed;
    return true; // 'todas'
  });

  return { 
    tasks: filteredTasks, // Ahora devolvemos las tareas ya filtradas
    filter,
    setFilter,
    addTask, 
    toggleTaskStatus, 
    deleteTask, 
    getStats 
  };
};