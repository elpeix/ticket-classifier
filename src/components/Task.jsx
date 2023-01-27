import React, { useContext } from 'react'
import styles from '../styles/Task.module.css'
import Tag from './Tag'
import { TasksContext } from './TasksProvider'

export default function Task({ task, index }) {

  const tasks = useContext(TasksContext)

  return (
    <li className={`${task.completed ? styles.completed : ''}`}>
      <div className={`${styles.task}`}>
        <div className={styles.checkbox}>
          <input 
            type="checkbox"
            checked={task.completed}
            onClick={() => tasks.toggleTask(index)}
            readOnly
          />
        </div>
        <span 
          className={styles.taskName}
          onClick={() => tasks.toggleTask(index)}>{task.name}</span>
        <div className={styles.tags}>
          { task.tags && task.tags.map((tag, index) => (
            <Tag key={index} index={index} tag={tag} />
          ))}
        </div>
      </div>
      <button
        className={styles.remove}
        onClick={() => tasks.removeTask(index)}>✕</button>
    </li>
  )
}