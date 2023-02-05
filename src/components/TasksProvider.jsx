import React, { createContext, useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import { classify } from '../services/cohere'

export const TasksContext = createContext()


// TODO: Split function to avoid too many lines

export default function TasksProvider ({ children }) {

  const { token } = useContext(AppContext)
  const [topic, setTopic] = useState('')
  const [tasks, setTasks] = useState([])
  const [sampleTasks, setSampleTasks] = useState([])
  const [archivedTasks, setArchivedTasks] = useState([])
  const [configurationMode, setConfigurationMode] = useState(false)
  const [filter, setFilter] = useState({
    status: '',
    tag: '',
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

    // Remove tags and user from taskInput
    taskInput = taskInput.replace(/(#|@)\w+/g, '').trim()

    if (taskInput === '') {
      throw new Error('Task cannot be empty')
    }

    if (tasks.some(task => task.name === taskInput)) {
      throw new Error('Task already exists')
    }
    const id = new Date().getTime()
    const newTask = {
      id: id,
      name: taskInput,
      completed: false,
      tag: tag
    }

    const newTasks = [...tasks]
    saveTasks([...newTasks, newTask])

    if (tag) {
      return
    }

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
    const data = await classify({
      token: token,
      input: taskInput,
      examples: examples
    })
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
        if (labels[example.label] < 4) {
          labels[example.label]++
        }
        return
      }
      labels[example.label] = 1
    })

    examples = examples.filter(example => {
      return labels[example.label] > 1
    })

    return examples
  }

  const examplesAreEmpty = () => {
    return !getExamples().length
  }

  const getTags = () => {
    const tags = {}
    getExamples().forEach(example => tags[example.label] = true)
    return Object.keys(tags)
  }

  const updateTask = (id, updatedTask) => {
    console.log('updatedTask', id)
    if (Object.keys(updatedTask).length === 0 || Object.hasOwn(updateTask, 'name') && updatedTask.name === '') {
      throw new Error('Task cannot be empty')
    }
    if (updatedTask.name && tasks.some(task => task.name === updatedTask.name && task.id !== id)) {
      throw new Error('Task already exists')
    }

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

  const saveTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  const saveTopic = (topic) => {
    setTopic(topic)
    setConfigurationMode(false)
    localStorage.setItem('topic', topic)
  }

  const elements = {
    tasks : getFilteredTasks(),
    totalTasks: tasks.length,
    filter : {
      status: filter.status,
      tag: filter.tag,
      name: filter.name,
      filterByTag,
      filterByStatus,
      filterByName
    },
    totals: {
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length
    },
    addTask,
    updateTask,
    toggleTask,
    removeTask,
    getTags,
    cleanCompletedTasks,
    sampleTasks,
    saveSampleTasks,
    topic,
    saveTopic,
    examplesAreEmpty,
    loading,
    configurationMode,
    setConfigurationMode
  }
  
  return (
    <TasksContext.Provider value={elements}>
      {children}
    </TasksContext.Provider>
  )
}