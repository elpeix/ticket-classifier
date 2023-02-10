import React, { useContext, useEffect, useRef } from 'react'
import { TasksContext } from './TasksProvider'
import styles from '../styles/FilterBar.module.css'

export default function FilterBar() {

  const tasks = useContext(TasksContext)
  const searchRef = useRef()

  useEffect(() => {
    if (tasks.searching) {
      searchRef.current.focus()
    }
  }, [tasks.searching])

  const handleKeyUp = (event) => {
    if (event.key === 'Escape') {
      tasks.filter.filterByName('')
      tasks.setSearching(false)
    }
  }

  const handleChange = e => tasks.filter.filterByName(e.target.value)
  const handleFocus = () => tasks.setSearching(true)
  const handleBlur = () => tasks.setSearching(false)

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
          ref={searchRef}
          type="text"
          placeholder="Filter by name"
          value={tasks.filter.name}
          onClick={handleFocus}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
        />
      </div>
    </div>
  )
}