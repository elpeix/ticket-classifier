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

export default function Container() {
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
    if (
      event.key === 'F5' ||
      (event.ctrlKey && event.key === 'r') ||
      (event.metaKey && event.key === 'r') ||
      (event.ctrlKey && event.key === 'F5') ||
      (event.metaKey && event.key === 'F5') ||
      event.key === 'Tab'
    ) {
      return
    }
    if (event.key === 'Escape') {
      if (tasks.configurationMode) {
        tasks.setConfigurationMode(false)
      } else if (tasks.filter.tag !== '') {
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

    if (event.key === 'h' || event.key === '?') {
      setShowHelp(!showHelp)
      return
    }

    if (showHelp) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (event.altKey && event.key === ',') {
      tasks.setConfigurationMode(true)
    }
    if (tasks.selection.selected && event.altKey && event.key === 'j') {
      tasks.moveTask(tasks.selection.selected.id, 'down')
      return
    }
    if (tasks.selection.selected && event.altKey && event.key === 'k') {
      tasks.moveTask(tasks.selection.selected.id, 'up')
      return
    }
    if (event.key === 'ArrowUp' || event.key === 'k') {
      tasks.selection.previous()
    }
    if (event.key === 'ArrowDown' || event.key === 'j') {
      tasks.selection.next()
    }
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'PageUp' ||
      (event.shiftKey && event.key === 'K')
    ) {
      tasks.selection.first()
    }
    if (
      event.key === 'ArrowRight' ||
      event.key === 'PageDown' ||
      (event.shiftKey && event.key === 'J')
    ) {
      tasks.selection.last()
    }
    if ((event.key === 'Delete' || event.key === 'd') && tasks.selection.selected) {
      tasks.removeTask(tasks.selection.selected.id)
    }
    if ((event.key === 'Enter' || event.key === 'x') && tasks.selection.selected) {
      tasks.toggleTask(tasks.selection.selected.id)
    }
    if ((event.key === ' ' || event.key === 'c') && tasks.selection.selected) {
      tasks.setEditing(tasks.selection.selected)
    }
    if (event.key === 'a') {
      tasks.setAdding(true)
    }
    if (event.key === 'f' || event.key === '/') {
      tasks.setSearching(true)
    }
    if (event.shiftKey && event.key === 'A') {
      tasks.filter.filterByStatus('')
    }
    if (event.shiftKey && event.key === 'P') {
      if (tasks.filter.status === 'pending') {
        tasks.filter.filterByStatus('')
      } else {
        tasks.filter.filterByStatus('pending')
      }
    }
    if (event.shiftKey && event.key === 'C') {
      if (tasks.filter.status === 'completed') {
        tasks.filter.filterByStatus('')
      } else {
        tasks.filter.filterByStatus('completed')
      }
    }
  }

  return (
    <div className={styles.tasksContainer} ref={ref} onKeyDown={handleKeyDown} tabIndex="0">
      <Layout>
        {tasks.loading && <div className={styles.loading} />}
        {!tasks.loading && showConfiguration && <Configuration />}
        {!tasks.loading && !showConfiguration && (
          <>
            <div className={styles.topic}>
              <h2>{tasks.topic}</h2>
              <button
                className={`simpleButton ${styles.configureButton}`}
                onClick={() => tasks.setConfigurationMode(true)}
                title="Configure (Alt+,)"
              >
                Configure
              </button>
            </div>
            <TaskInput />
            <FilterBar />
            <TaskList />
            <div className={styles.footer}>
              <div className={styles.cleaner}>
                <CleanerCompleted />
              </div>
              <div>
                <TasksCounter />
              </div>
              <button
                className={`simpleButton ${styles.helpButton}`}
                onClick={() => setShowHelp(!showHelp)}
                title="Help (h)"
              >
                <span className="material-icons">?</span>
              </button>
            </div>
          </>
        )}
        <Help show={showHelp} onClose={() => setShowHelp(false)} />
      </Layout>
    </div>
  )
}
