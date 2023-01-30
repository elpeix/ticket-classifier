import React, { useContext } from 'react'
import styles from '../styles/Task.module.css'
import Tag from './Tag'
import { TasksContext } from './TasksProvider'

export default function Task({ task }) {

  const tasks = useContext(TasksContext)

  return (
    <li className={`${task.completed ? styles.completed : ''}`}>
      <div className={`${styles.task}`}>
        <div className={styles.checkboxDiv}>
          <input 
            type="checkbox"
            checked={task.completed}
            className={styles.checkbox}
            onClick={() => tasks.toggleTask(task.id)}
            readOnly
          />
        </div>
        <span className={styles.name}>{task.name}</span>
        <Tag tag={task.tag} />
      </div>
      <button
        className='remove'
        onClick={() => tasks.removeTask(task.id)}>✕</button>
    </li>
  )
}