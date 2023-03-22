import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/TaskInput.module.css'
import { TasksContext } from './TasksProvider'

export default function TaskInput() {

  const tasks = useContext(TasksContext)
  
  const [taskInput, setTaskInput] = useState('')
  const [error, setError] = useState('')
  const taskInputRef = useRef()

  useEffect(() => {
    if (tasks.adding) {
      taskInputRef.current.focus()
    }
  }, [tasks.adding])


  const handleChange = (e) => {
    setError('')
    setTaskInput(e.target.value)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleClick()
      if (!e.ctrlKey) {
        e.currentTarget.blur()
      }

    }
    if (e.key === 'Escape') {
      if (taskInput === '') {
        e.currentTarget.blur()
      }
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

  const handleFocus = () => tasks.setAdding(true)
  const handleBlur = () => tasks.setAdding(false)

  return (
    <div className={styles.container}>
      <div className={styles.taskInput}>
        <input 
          ref={taskInputRef}
          className={styles.input}
          type="text"
          placeholder="Add task"
          onClick={handleFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyUp={handleKeyUp} 
          value={taskInput}
        />
        <button
          className={styles.button} 
          onClick={handleClick}
          title="Add (a)">
            Add
        </button>
      </div>
      { error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}