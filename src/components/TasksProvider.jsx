import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { classify } from '../services/cohere'
import { AppContext } from './TaskApp'
import TaskSelector from '../services/TaskSelector'
import useTheme from '../hooks/useTheme'

export const TasksContext = createContext()

// TODO: Split function to avoid too many lines

export default function TasksProvider({ children }) {
  const { token } = useContext(AppContext)
  const [topic, setTopic] = useState('')
  const [tasks, setTasks] = useState([])
  const [sampleTasks, setSampleTasks] = useState([])
  const [archivedTasks, setArchivedTasks] = useState([])
  const [configurationMode, setConfigurationMode] = useState(false)
  const [filter, setFilter] = useState({ status: '', tag: '', name: '' })
  const [loading, setLoading] = useState(true)
  const [addMode, setAddMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [lastAdded, setLastAdded] = useState(null)

  const [compactMode, setCompactMode] = useTheme()

  useEffect(() => {
    document.body.classList.toggle('compact', compactMode)
  }, [compactMode])

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
    let tags = taskInput.match(/#[\w-]+/g)
    let tag = ''
    if (tags) {
      tags = tags.map((tag) => tag.replace('#', ''))
      tag = tags[0]
    }

    // Remove tags and user from taskInput
    taskInput = taskInput.replace(/(#|@)[\w-]+/g, '').trim()

    if (taskInput === '') {
      throw new Error('Task cannot be empty')
    }

    if (tasks.some((task) => task.name === taskInput)) {
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
    setLastAdded(newTask)

    if (tag) {
      return newTask
    }

    getTag(taskInput)
      .then((tag) => {
        if (tag) {
          newTask.tag = tag
          saveTasks([...newTasks, newTask])
        }
        setLoading(false)
      })
      .catch((err) => {
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

  const getAllExamples = () => {
    let examples = []
    // Get examples from sample tasks
    sampleTasks.forEach((task) => {
      task.tag &&
        examples.push({
          text: task.name,
          label: task.tag
        })
    })

    // Get examples from current tasks
    tasks.forEach((task) => {
      task.tag &&
        examples.push({
          text: task.name,
          label: task.tag
        })
    })

    // Get more examples from archived tasks
    archivedTasks.forEach((task) => {
      task.tag &&
        examples.push({
          text: task.name,
          label: task.tag
        })
    })
    return examples
  }

  const getExamples = () => {
    let examples = getAllExamples()

    // Check if there are enough examples and at least 2 labels from each tag
    const labels = {}
    examples.forEach((example) => {
      if (labels[example.label]) {
        if (labels[example.label] < 4) {
          labels[example.label]++
        }
        return
      }
      labels[example.label] = 1
    })

    examples = examples.filter((example) => {
      return labels[example.label] > 1
    })

    return examples
  }

  const examplesAreEmpty = () => {
    return !getExamples().length
  }

  const getTags = () => {
    const tags = {}
    getAllExamples().forEach((example) => (tags[example.label] = true))
    return Object.keys(tags)
  }

  const updateTask = (id, updatedTask) => {
    if (
      Object.keys(updatedTask).length === 0 ||
      (Object.hasOwn(updateTask, 'name') && updatedTask.name === '')
    ) {
      throw new Error('Task cannot be empty')
    }
    if (
      updatedTask.name &&
      tasks.some((task) => task.name === updatedTask.name && task.id !== id)
    ) {
      throw new Error('Task already exists')
    }

    const newTasks = [...tasks]
    const task = newTasks.find((task) => task.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    Object.assign(task, updatedTask)
    saveTasks(newTasks)
  }

  const filterByTag = (tag) => {
    setFilter({ ...filter, tag: filter.tag === tag ? '' : tag })
  }

  const filterByStatus = (status) => {
    setSelectedTask(null)
    setFilter({ ...filter, status: status })
  }

  const filterByName = (name) => {
    setFilter({ ...filter, name: name })
  }

  const filteredTasks = useMemo(() => {
    let filteredTasks = tasks.map((task, index) => {
      return { ...task, index }
    })
    if (filter.tag) {
      filteredTasks = tasks.filter((task) => task.tag === filter.tag)
    }
    if (filter.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.completed === (filter.status === 'completed')
      )
    }
    if (filter.name) {
      filteredTasks = filteredTasks.filter((task) =>
        task.name.toLowerCase().includes(filter.name.toLowerCase())
      )
    }
    return filteredTasks.map((task) => {
      const newTask = { ...task, selected: false }
      if (filter.name) {
        const index = newTask.name.toLowerCase().indexOf(filter.name.toLowerCase())
        newTask.name = [
          newTask.name.substring(0, index),
          <span className="highlight" key={index}>
            {newTask.name.substring(index, index + filter.name.length)}
          </span>,
          newTask.name.substring(index + filter.name.length)
        ]
      }
      if (selectedTask && selectedTask.id === task.id) {
        newTask.selected = true
      }
      return newTask
    })
  }, [tasks, filter, selectedTask])

  const cleanCompletedTasks = () => {
    const newArchivedTasks = archivedTasks.concat(
      tasks.filter((task) => task.completed && task.tag)
    )
    setArchivedTasks(newArchivedTasks)
    localStorage.setItem('archivedTasks', JSON.stringify(newArchivedTasks))
    saveTasks(tasks.filter((task) => !task.completed))
  }

  const cleanArchivedTasks = () => {
    setArchivedTasks([])
    localStorage.setItem('archivedTasks', JSON.stringify([]))
  }

  const restoreArchivedTasks = () => {
    const newTasks = tasks.concat(archivedTasks)
    saveTasks(newTasks)
    setArchivedTasks([])
    localStorage.setItem('archivedTasks', JSON.stringify([]))
  }

  const saveSampleTasks = (newSampleTasks) => {
    setSampleTasks(newSampleTasks)
    localStorage.setItem('sampleTasks', JSON.stringify(newSampleTasks))
  }

  const moveTask = (id, direction) => {
    if (direction !== 'up' && direction !== 'down') {
      throw new Error('Invalid direction')
    }
    const newTasks = [...tasks]
    const index = newTasks.findIndex((task) => task.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    if (direction === 'up' && index > 0) {
      const temp = newTasks[index]
      newTasks[index] = newTasks[index - 1]
      newTasks[index - 1] = temp
      setSelectedTask(temp)
    } else if (direction === 'down' && index < newTasks.length - 1) {
      const temp = newTasks[index]
      newTasks[index] = newTasks[index + 1]
      newTasks[index + 1] = temp
      setSelectedTask(temp)
    }
    saveTasks(newTasks)
  }

  const removeTask = (id) => {
    saveTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = (id) => {
    const newTasks = [...tasks]
    const index = newTasks.findIndex((task) => task.id === id)
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

  const selectNext = () => {
    new TaskSelector(filteredTasks).selectNext((t) => setSelectedTask(t))
  }

  const selectPrevious = () => {
    new TaskSelector(filteredTasks).selectPrevious((t) => setSelectedTask(t))
  }

  const selectTask = (id) => {
    new TaskSelector(filteredTasks).select(id, (t) => setSelectedTask(t))
  }

  const selectFirst = () => {
    new TaskSelector(filteredTasks).selectFirst((t) => setSelectedTask(t))
  }

  const selectLast = () => {
    new TaskSelector(filteredTasks).selectLast((t) => setSelectedTask(t))
  }

  const setEditing = (mode) => {
    setSelectedTask(null)
    setEditMode(mode)
    if (mode) {
      setAddMode(false)
      setSearchMode(false)
    }
  }

  const setAdding = (mode) => {
    setSelectedTask(null)
    setAddMode(mode)
    if (mode) {
      setEditMode(false)
      setSearchMode(false)
    }
  }

  const setSearching = (mode) => {
    setSelectedTask(null)
    setSearchMode(mode)
    if (mode) {
      setEditMode(false)
      setAddMode(false)
    }
  }

  const elements = {
    tasks: filteredTasks,
    totalTasks: tasks.length,
    filter: {
      status: filter.status,
      tag: filter.tag,
      name: filter.name,
      filterByTag,
      filterByStatus,
      filterByName
    },
    totals: {
      total: tasks.length,
      filtered: filteredTasks.length != tasks.length ? filteredTasks.length : null,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length
    },
    selection: {
      clean: () => setSelectedTask(null),
      next: selectNext,
      previous: selectPrevious,
      first: selectFirst,
      last: selectLast,
      selected: selectedTask,
      select: selectTask
    },
    addTask,
    lastAdded,
    updateTask,
    toggleTask,
    moveTask,
    removeTask,
    getTags,
    cleanCompletedTasks,
    sampleTasks,
    saveSampleTasks,
    archivedTasks,
    cleanArchivedTasks,
    restoreArchivedTasks,
    topic,
    saveTopic,
    examplesAreEmpty,
    loading,
    editing: editMode,
    setEditing,
    adding: addMode,
    setAdding,
    searching: searchMode,
    setSearching,
    configurationMode,
    setConfigurationMode,
    compactMode,
    setCompactMode
  }

  return <TasksContext.Provider value={elements}>{children}</TasksContext.Provider>
}
