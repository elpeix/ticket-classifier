import React, { useState } from 'react'
import styles from '../styles/Task.module.css'

export default function Task({ task, index, removeTask }) {

  const [completed, setCompleted] = useState(task.completed)

  const handleCompleteClick = () => {
    setCompleted(!completed)
  }

  return (
    <li className={`${completed ? styles.completed : ''}`}>
      <div className={`${styles.task}`}>
        <div className={styles.checkbox}>
          <input 
            type="checkbox"
            checked={completed}
            onClick={handleCompleteClick}
            readOnly
          />
        </div>
        <span 
          className={styles.taskName}
          onClick={handleCompleteClick}>{task.name}</span>
        <div className={styles.tags}>
          <span className={styles.tag}>tag</span>
        </div>
      </div>
      <button
        className={styles.remove}
        onClick={() => removeTask(index)}>✕</button>
    </li>
  )
}