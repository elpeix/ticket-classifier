import React, { useContext } from 'react'
import styles from '../styles/Task.module.css'
import Tag from './Tag'
import { TasksContext } from './TasksProvider'

export default function Task({ task }) {

  const tasks = useContext(TasksContext)

  return (
    <li className={`${task.completed ? styles.completed : ''}`}>
      <div className={`${styles.task}`}>
        <div className={styles.checkbox}>
          <input 
            type="checkbox"
            checked={task.completed}
            onClick={() => tasks.toggleTask(task.index)}
            readOnly
          />
        </div>
        <span 
          className={styles.taskName}
          onClick={() => tasks.toggleTask(task.index)}>{task.name}</span>
        <div className={styles.tags}>
          { task.tags && task.tags.map((tag, index) => (
            <Tag key={index} index={index} tag={tag} />
          ))}
        </div>
      </div>
      <button
        className={styles.remove}
        onClick={() => tasks.removeTask(task.index)}>✕</button>
    </li>
  )
}