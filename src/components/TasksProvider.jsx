import React, { createContext, useEffect, useState } from 'react'

export const TasksContext = createContext()

export default function TasksProvider ({ children }) {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
    setLoading(false)
  }, [])

  const addTask = (taskInput) => {
    if (taskInput === '') {
      return
    }
    // TODO: Call classifier
    const newTasks = [...tasks]
    saveTasks([...newTasks, {
      name: taskInput,
      completed: false,
      tags: []
    }])
  }

  const cleanCompletedTasks = () => {
    saveTasks(tasks.filter(task => !task.completed))
  }

  const removeTask = (index) => {
    saveTasks(tasks.filter((_, i) => index !== i))
  }

  const toggleTask = (index) => {
    const newTasks = [...tasks]
    newTasks[index].completed = !newTasks[index].completed
    saveTasks(newTasks)
  }

  const saveTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  const elements = {
    tasks : tasks,
    addTask,
    cleanCompletedTasks,
    removeTask,
    toggleTask,
    loading
  }
  
  return (
    <TasksContext.Provider value={elements}>
      {children}
    </TasksContext.Provider>
  )
}