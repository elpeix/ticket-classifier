import React, { createContext, useEffect, useReducer, useState } from 'react'
import TasksReducer from '../../reducers/taskReducer'

export const TasksContext = createContext()

export default function TasksProvider ({ children }) {

  const [stateTasks, setTasks] = useState([])
  const [tasks, dispatch] = useReducer(TasksReducer, (() => {
    const storedTasks = localStorage.getItem('tasks')
    return storedTasks ? JSON.parse(storedTasks) : []
  })())

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  const addTask = (taskInput) => {
    if (taskInput === '') {
      return
    }
    dispatch({ type: 'ADD_TASK', payload: {
      name: taskInput,
      completed: false,
      tags: []
    }})
  }

  const cleanCompletedTasks = () => {
    dispatch({ type: 'CLEAN_COMPLETED_TASKS' })
  }

  const removeTask = (index) => {
    dispatch({ type: 'REMOVE_TASK', payload: index })
  }

  const toggleTask = (index) => {
    const newTasks = [...stateTasks]
    newTasks[index].completed = !newTasks[index].completed
    saveTasks(newTasks)
  }

  const saveTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  const elements = {
    tasks,
    addTask,
    cleanCompletedTasks,
    removeTask,
    toggleTask
  }
  
  return (
    <TasksContext.Provider value={elements}>
      {children}
    </TasksContext.Provider>
  )
}