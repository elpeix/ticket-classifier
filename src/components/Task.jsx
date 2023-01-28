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
            onClick={() => tasks.toggleTask(task.id)}
            readOnly
          />
        </div>
        <span className={styles.taskName}>{task.name}</span>
        <Tag tag={task.tag} />
      </div>
      <button
        className={styles.remove}
        onClick={() => tasks.removeTask(task.id)}>✕</button>
    </li>
  )
}