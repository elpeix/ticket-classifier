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

  return (
    <>
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
    </>
  )
}