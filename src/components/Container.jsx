import React, { useContext } from 'react'
import CleanerCompleted from './CleanerCompleted'
import Configuration from './Configuration'
import FilterBar from './FilterBar'
import TaskInput from './TaskInput'
import TaskList from './TaskList'
import { TasksContext } from './TasksProvider'
import styles from '../styles/Container.module.css'

export default function Container () {

  const tasks = useContext(TasksContext)
  const showConfiguration = tasks.examplesAreEmpty() || tasks.configurationMode 

  const handleKeyDown = (event) => {
    if (tasks.loading || tasks.editing) {
      return
    }
    if (event.key === 'Escape') {
      tasks.setConfigurationMode(false)
      tasks.selection.clean()
    }
    if (event.altKey && event.key === ',') {
      tasks.setConfigurationMode(true)
    }
    if (event.key === 'ArrowUp') {
      tasks.selection.previous()
    }
    if (event.key === 'ArrowDown') {
      tasks.selection.next()
    }
    if (event.key === 'Delete') {
      tasks.removeTask(tasks.selection.selected.id)
    }
    if (event.key === 'Enter') {
      if (tasks.selection.selected) {
        tasks.toggleTask(tasks.selection.selected.id)
      }
    }
    console.log(event.key)
  }

  return (
    <div onKeyDown={handleKeyDown} tabIndex='0'>
      { tasks.loading && <div className={styles.loading} /> }
      { !tasks.loading && showConfiguration  && <Configuration />}
      { !tasks.loading && !showConfiguration && (
        <>
          <div className={styles.topic}>
            <h2>{tasks.topic}</h2>
            <button 
              className={`simpleButton ${styles.configureButton}`} 
              onClick={() => tasks.setConfigurationMode(true)}>
              Configure
            </button>
          </div>
          <TaskInput />
          <FilterBar />
          <TaskList />
          <CleanerCompleted />
        </>
      )}
    </div>
  )
}