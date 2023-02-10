import React, { useContext, useEffect, useRef } from 'react'
import CleanerCompleted from './CleanerCompleted'
import Configuration from './Configuration'
import FilterBar from './FilterBar'
import TaskInput from './TaskInput'
import TaskList from './TaskList'
import { TasksContext } from './TasksProvider'
import styles from '../styles/Container.module.css'

export default function Container () {

  const tasks = useContext(TasksContext)
  const showConfiguration = tasks.configurationMode 
  const ref = useRef()

  useEffect(() => {
    if (!tasks.editing && !tasks.adding && !tasks.searching && !tasks.configurationMode) {
      ref.current.focus()
    }
  }, [tasks.editing, tasks.adding, tasks.searching, tasks.configurationMode])

  const handleKeyDown = (event) => {
    if (tasks.loading || tasks.editing || tasks.adding || tasks.searching) {
      return
    }
    if (event.key === 'Escape') {
      tasks.setConfigurationMode(false)
      tasks.selection.clean()
    }
    if (tasks.configurationMode) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (event.altKey && event.key === ',') {
      tasks.setConfigurationMode(true)
    }
    if (event.key === 'ArrowUp') {
      tasks.selection.previous()
    }
    if (event.key === 'ArrowDown') {
      tasks.selection.next()
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      tasks.selection.first()
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      tasks.selection.last()
    }
    if (event.key === 'Delete') {
      tasks.removeTask(tasks.selection.selected.id)
    }
    if (event.key === 'Enter' && tasks.selection.selected) {
      tasks.toggleTask(tasks.selection.selected.id)
    }
    if (event.key === ' ' && tasks.selection.selected) {
      tasks.setEditing(tasks.selection.selected)
    }
    if (event.key === 'a') {
      tasks.setAdding(true)
    }
    if (event.key === 'f') {
      tasks.setSearching(true)
    }
  }

  return (
    <div className={styles.tasksContainer} ref={ref} onKeyDown={handleKeyDown} tabIndex='0'>
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