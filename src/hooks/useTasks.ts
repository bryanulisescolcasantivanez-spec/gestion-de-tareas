import { useState, useEffect } from 'react';

// 1. TIPADO ESTRICTO (TypeScript): Definimos exactamente qué es una Tarea
export interface Task {
  id: string;
  title: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  createdAt: string;
}

export const useTasks = () => {
  // 2. ESTADO INICIAL Y PERSISTENCIA (LocalStorage)
  // React leerá el localStorage solo la primera vez que la app cargue
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // 3. EFECTO SECUNDARIO: Cada vez que 'tasks' cambie, guardamos en localStorage automáticamente
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 4. LÓGICA PRINCIPAL (Modificadores de Estado)
  const addTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    // En React no hacemos ".push()", creamos un arreglo nuevo con la tarea añadida
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // 5. ESTADÍSTICAS
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const urgent = tasks.filter(t => !t.completed && t.priority === 'alta').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, urgent, progress };
  };

  // 6. EXPORTAMOS LO QUE LA INTERFAZ NECESITA USAR
  return { 
    tasks, 
    addTask, 
    toggleTaskStatus, 
    deleteTask, 
    getStats 
  };
};