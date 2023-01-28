import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'
import styles from '../styles/FilterBar.module.css'

export default function FilterBar() {

  const tasks = useContext(TasksContext)

  return (
    <div className={styles.bar}>
      <div className={styles.filterByStatus}>
        <button 
          onClick={() => tasks.filter.filterByStatus('')}
          className={tasks.filter.status === '' ? styles.active : ''}
        >
          All
        </button>
        <button 
          onClick={() => tasks.filter.filterByStatus('completed')}
          className={tasks.filter.status === 'completed' ? styles.active : ''}
        >
          Completed
        </button>
        <button 
          onClick={() => tasks.filter.filterByStatus('pending')}
          className={tasks.filter.status === 'pending' ? styles.active : ''}
        >
          Pending
        </button>
      </div>
      { tasks.filter.tag !== '' && (
        <div className={styles.filterByTag}>
          <span>Filter by tag {tasks.filter.tag}:</span>
          <button
            onClick={() => tasks.filter.filterByTag('')}
            className={tasks.filter.tag === '' ? styles.active : ''}
          >
            All
          </button>
        </div>
      )}

      <div className={styles.filterByName}>
        <input
          type="text"
          placeholder="  Filter by name"
          value={tasks.filter.name}
          onChange={e => tasks.filter.filterByName(e.target.value)}
          onKeyUp={e => e.key === 'Escape' && tasks.filter.filterByName('')}
        />
      </div>
    </div>
  )
}