import React, { useContext } from 'react'
import styles from '../styles/TaskList.module.css'
import Task from './Task'
import { TasksContext } from './TasksProvider'

export default function TaskList() {

  const tasks = useContext(TasksContext)
  const empty = tasks.tasks.length === 0
  
  return ( 
    <>
      { empty && (
        <div className={styles.empty}>No tasks yet</div>
      )}
      { !empty && (
        <ul className={styles.list}>
          { tasks.tasks.map((task, index) => (
            <Task 
              key={index}
              task={task}
              index={index}
              removeTask={tasks.removeTask} 
              toggleTask={tasks.toggleTask}
            />
          ))}
        </ul>
      )}
    </>
  )
}