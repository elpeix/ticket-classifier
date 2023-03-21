import React, { useContext, useEffect, useRef, useState } from 'react'
import CleanerCompleted from './CleanerCompleted'
import Configuration from './Configuration'
import FilterBar from './FilterBar'
import TaskInput from './TaskInput'
import TaskList from './TaskList'
import { TasksContext } from './TasksProvider'
import styles from '../styles/Container.module.css'
import Layout from './Layout'
import TasksCounter from './TasksCounter'
import Help from './Help'

export default function Container () {

  const tasks = useContext(TasksContext)
  const showConfiguration = tasks.configurationMode 
  const [showHelp, setShowHelp] = useState(false)
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
    if (event.key === 'F5' 
      || event.ctrlKey && event.key === 'r'
      || event.metaKey && event.key === 'r'
      || event.ctrlKey && event.key === 'F5'
      || event.metaKey && event.key === 'F5') {
      return
    }
    if (event.key === 'Escape') {
      if (tasks.configurationMode) {
        tasks.setConfigurationMode(false)
      } else if ( tasks.filter.tag !== '') {
        tasks.filter.filterByTag('')
      }
      tasks.selection.clean()
      if (showHelp) {
        setShowHelp(false)
      }
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
    if (event.key === 'p') {
      if (tasks.filter.status === 'pending') {
        tasks.filter.filterByStatus('')
      } else {
        tasks.filter.filterByStatus('pending')
      }
    }
    if (event.key === 'c') {
      if (tasks.filter.status === 'completed') {
        tasks.filter.filterByStatus('')
      } else {
        tasks.filter.filterByStatus('completed')
      }
    }
    if (event.key === 'h') {
      setShowHelp(!showHelp)
    }
  }

  return (
    <div className={styles.tasksContainer} ref={ref} onKeyDown={handleKeyDown} tabIndex='0'>
      <Layout>
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
            <div className={styles.footer}>
              <div>
                <CleanerCompleted />
              </div>
              <div>
                <TasksCounter />
              </div>
            </div>
          </>
        )}
        <Help show={showHelp} onClose={() => setShowHelp(false)} />
      </Layout>
    </div>
  )
}