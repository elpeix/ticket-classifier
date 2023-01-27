import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'
import styles from '../styles/FilterBar.module.css'

export default function FilterBar() {

  const tasks = useContext(TasksContext)

  const showFilterBar = true

  return (
    <>
      { showFilterBar && (
        <div className={styles.bar}>
          <span>Filter by:</span>
          <button 
            onClick={() => tasks.filter.filterByStatus('')}
            className={tasks.filter.status === '' ? styles.active : ''}
          >
            All
          </button>
          <button 
            onClick={() => tasks.filter.filterByStatus('completed')}
            className={tasks.filter.status === '' ? styles.active : ''}
          >
            Completed
          </button>
          <button 
            onClick={() => tasks.filter.filterByStatus('pending')}
            className={tasks.filter.status === '' ? styles.active : ''}
          >
            Pending
          </button>
        </div>
      )}
    </>
  )
}