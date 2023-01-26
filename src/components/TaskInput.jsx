import React, { useContext, useState } from 'react'
import styles from '../styles/TaskInput.module.css'
import { TasksContext } from './TasksProvider'

export default function TaskInput() {

  const tasks = useContext(TasksContext)
  
  const [taskInput, setTaskInput] = useState('')

  const handleChange = (e) => {
    setTaskInput(e.target.value)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleClick()
    }
    if (e.key === 'Escape') {
      setTaskInput('')
    }
  }

  const handleClick = () => {
    if (taskInput === '') {
      return
    }
    tasks.addTask(taskInput)
    setTaskInput('')
  }

  return (
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
  )
}