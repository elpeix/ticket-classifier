import React, { useContext, useState } from 'react'
import styles from '../styles/TaskInput.module.css'
import { TasksContext } from './TasksProvider'

export default function TaskInput() {

  const tasks = useContext(TasksContext)
  
  const [taskInput, setTaskInput] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setError('')
    setTaskInput(e.target.value)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleClick()
    }
    if (e.key === 'Escape') {
      setError('')
      setTaskInput('')
    }
  }

  const handleClick = () => {
    if (taskInput === '') {
      return
    }
    try {
      tasks.addTask(taskInput)
      setError('')
    } catch (e) {
      setError(e.message)
    }
    setTaskInput('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.taskInput}>
        <input 
          className={styles.input}
          type="text"
          placeholder="Add task" 
          onChange={handleChange}
          onKeyUp={handleKeyUp} 
          value={taskInput} />
        <button
          className={styles.button} 
          onClick={handleClick}>
            Add
        </button>
      </div>
      { error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}