import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'
import styles from '../styles/TasksCounter.module.css'

export default function TasksCounter() {

  const tasks = useContext(TasksContext)

  const completedPercent = tasks.totals.total > 0 ? Math.round(tasks.totals.completed / tasks.totals.total * 100) : 0

  return (
    <div className={styles.tasksCounter}>
      { tasks.totals.total > 0 && (
        <>
          <div className={styles.bar}>
            <div className={styles.completedBar} style={{ width: `${completedPercent}%` }} />
          </div>
          <div className={styles.counter}>
            {tasks.totals.total > 0 && (
              <div className={styles.total}>
                <span>Total:</span>
                {tasks.totals.total}
              </div>
            )}
            {tasks.totals.completed > 0 && (
              <div className={styles.completed}>
                <span>Completed:</span>
                {tasks.totals.completed}
              </div>
            )}
            {tasks.totals.pending > 0 && (
              <div className={styles.pending}>
                <span>Pending:</span>
                {tasks.totals.pending}
              </div>
            )}
            {tasks.totals.filtered !== null && (
              <div className={styles.filtered}>
                <span>Filter:</span>
                {tasks.totals.filtered}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
