import React, { createContext, useEffect, useState } from 'react'

export const TasksContext = createContext()

export default function TasksProvider ({ children }) {

  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState({
    status: '',
    tag: '',
    user: '',
    name: ''    
  })
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
      throw new Error('Task cannot be empty')
    }
    
    // Get tags from taskInput
    let tags = taskInput.match(/#\w+/g)
    if (tags) {
      tags = tags.map(tag => tag.replace('#', ''))
    }
    
    // Get user from taskInput
    let user = taskInput.match(/@\w+/g)
    if (user) {
      user = user.map(user => user.replace('@', ''))
    }
    
    // Remove tags and user from taskInput
    taskInput = taskInput.replace(/(#|@)\w+/g, '').trim()

    if (taskInput === '') {
      throw new Error('Task cannot be empty')
    }

    if (tasks.some(task => task.name === taskInput)) {
      throw new Error('Task already exists')
    }

    // TODO: Call classifier

    const newTasks = [...tasks]
    saveTasks([...newTasks, {
      name: taskInput,
      completed: false,
      tags: tags,
      user: user && user[0]
    }])
  }

  const filterByTag = (tag) => {
    setFilter({
      ...filter,
      tag: filter.tag === tag ? '' : tag
    })
  }

  const filterByUser = (user) => {
    setFilter({
      ...filter,
      user: filter.user === user ? '' : user
    })
  }

  const filterByStatus = (status) => {
    setFilter({
      ...filter,
      status: status
    })
  }

  const filterByName = (name) => {
    setFilter({
      ...filter,
      name: name
    })
  }

  const getFilteredTasks = () => {
    let filteredTasks = [ ...tasks ]
    if (filter.tag) {
      filteredTasks = tasks.filter(task => task.tags && task.tags.includes(filter.tag))
    }
    if (filter.user) {
      filteredTasks = filteredTasks.filter(task => task.user === filter.user)
    }
    if (filter.status) {
      filteredTasks = filteredTasks.filter(task => task.completed === (filter.status === 'completed'))
    }
    if (filter.name) {
      filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(filter.name.toLowerCase()))
    }
    return filteredTasks
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

  const getTask = (index) => {
    return tasks[index]
  }

  const saveTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  const elements = {
    tasks : getFilteredTasks(),
    totalTasks: tasks.length,
    filter : {
      status: filter.status,
      tag: filter.tag,
      user: filter.user,
      name: filter.name,
      filterByTag,
      filterByUser,
      filterByStatus,
      filterByName
    },
    totals: {
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length
    },
    addTask,
    getTask,
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