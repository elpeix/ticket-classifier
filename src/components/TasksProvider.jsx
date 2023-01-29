import React, { createContext, useEffect, useState } from 'react'
import { classify } from '../services/classifier'

export const TasksContext = createContext()

export default function TasksProvider ({ children }) {

  const [topic, setTopic] = useState('')
  const [tasks, setTasks] = useState([])
  const [sampleTasks, setSampleTasks] = useState([])
  const [archivedTasks, setArchivedTasks] = useState([])
  const [filter, setFilter] = useState({
    status: '',
    tag: '',
    user: '',
    name: ''    
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedTopic = localStorage.getItem('topic')
    if (storedTopic) {
      setTopic(storedTopic)
    }
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
    const storedSampleTasks = localStorage.getItem('sampleTasks')
    if (storedSampleTasks) {
      setSampleTasks(JSON.parse(storedSampleTasks))
    }
    const storedArchivedTasks = localStorage.getItem('archivedTasks')
    if (storedArchivedTasks) {
      setArchivedTasks(JSON.parse(storedArchivedTasks))
    }
    setLoading(false)
  }, [])

  const addTask = (taskInput) => {
    if (taskInput === '') {
      throw new Error('Task cannot be empty')
    }
    
    // Get tags from taskInput
    let tags = taskInput.match(/#\w+/g)
    let tag = ''
    if (tags) {
      tags = tags.map(tag => tag.replace('#', ''))
      tag = tags[0]
    }
    
    // Get user from taskInput - TODO
    let users = taskInput.match(/@\w+/g)
    let user = ''
    if (users) {
      users = users.map(user => user.replace('@', ''))
      user = user[0]
    }
    
    // Remove tags and user from taskInput
    taskInput = taskInput.replace(/(#|@)\w+/g, '').trim()

    if (taskInput === '') {
      throw new Error('Task cannot be empty')
    }

    if (tasks.some(task => task.name === taskInput)) {
      throw new Error('Task already exists')
    }
    const id = tasks.length
    const newTask = {
      id: id,
      name: taskInput,
      completed: false,
      tag: tag,
      user: user
    }

    const newTasks = [...tasks]
    saveTasks([...newTasks, newTask])

    if (tag) {
      return
    }

    setLoading(true)
    getTag(taskInput)
      .then(tag => {
        if (tag) {
          newTask.tag = tag
          saveTasks([...newTasks, newTask])
        }
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const getTag = async (taskInput) => {
    const examples = getExamples()

    if (examples.length <= 3) {
      return ''
    }
    const data = await classify(taskInput, examples)
    if (data && typeof data === 'string') {
      return data
    }
    return ''
  }

  const getExamples = () => {
    let examples = []
    // Get examples from sample tasks
    sampleTasks.forEach(task => {
      task.tag && examples.push({
        text: task.name,
        label: task.tag
      })
    })

    // Get examples from current tasks
    tasks.forEach(task => {
      task.tag && examples.push({ 
        text: task.name, 
        label: task.tag
      })
    })
    // Get more examples from archived tasks
    archivedTasks.forEach(task => {
      task.tag && examples.push({
        text: task.name,
        label: task.tag
      })
    })

    // Check if there are enough examples and at least 2 labels from each tag
    const labels = {}
    examples.forEach(example => {
      if (labels[example.label]) {
        labels[example.label]++
      } else {
        labels[example.label] = 1
      }
    })

    examples = examples.filter(example => {
      return labels[example.label] > 1
    })

    return examples
  }

  const examplesIsEmpty = () => {
    return !getExamples().length
  }

  const updateTask = (id, updatedTask) => {
    const newTasks = [...tasks]
    const task = newTasks.find(task => task.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    Object.assign(task, updatedTask)
    saveTasks(newTasks)
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
    let filteredTasks = tasks.map((task, index) => {
      return { ...task, index }
    })
    if (filter.tag) {
      filteredTasks = tasks.filter(task => task.tag === filter.tag)
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
    return filteredTasks.map(task => {
      const newTask = { ...task }
      if (filter.name) {
        const index = newTask.name.toLowerCase().indexOf(filter.name.toLowerCase())
        newTask.name = [
          newTask.name.substring(0, index),
          <span className="highlight" key={index}>{newTask.name.substring(index, index + filter.name.length)}</span>,
          newTask.name.substring(index + filter.name.length)
        ]
      }
      return newTask
    })
  }

  const cleanCompletedTasks = () => {
    const newArchivedTasks = archivedTasks.concat(tasks.filter(task => task.completed && task.tag))
    setArchivedTasks(newArchivedTasks)
    localStorage.setItem('archivedTasks', JSON.stringify(newArchivedTasks))
    saveTasks(tasks.filter(task => !task.completed))
  }

  const saveSampleTasks = (newSampleTasks) => {
    setSampleTasks(newSampleTasks)
    localStorage.setItem('sampleTasks', JSON.stringify(newSampleTasks))
  }

  const removeTask = (id) => {
    saveTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = (id) => {
    const newTasks = [...tasks]
    const index = newTasks.findIndex(task => task.id === id)
    newTasks[index].completed = !newTasks[index].completed
    saveTasks(newTasks)
  }

  const getTask = (id) => {
    return tasks.find(task => task.id === id)
  }

  const saveTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  const saveTopic = (topic) => {
    setTopic(topic)
    localStorage.setItem('topic', topic)
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
    updateTask,
    getTask,
    cleanCompletedTasks,
    sampleTasks,
    saveSampleTasks,
    topic,
    saveTopic,
    examplesIsEmpty,
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