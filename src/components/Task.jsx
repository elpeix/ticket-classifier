import React from 'react'
import styles from '../styles/Task.module.css'

export default function Task({ task, index, removeTask, toggleTask }) {

  return (
    <li className={`${task.completed ? styles.completed : ''}`}>
      <div className={`${styles.task}`}>
        <div className={styles.checkbox}>
          <input 
            type="checkbox"
            checked={task.completed}
            onClick={() => toggleTask(index)}
            readOnly
          />
        </div>
        <span 
          className={styles.taskName}
          onClick={() => toggleTask(index)}>{task.name}</span>
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