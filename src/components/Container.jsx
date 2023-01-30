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
      { showConfiguration  && <Configuration />}
      { !showConfiguration && (
        <>
          <div className={styles.topic}>
            <h2>{tasks.topic}</h2>
            <button className='simpleButton' onClick={() => tasks.setConfigurationMode(true)}>
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