import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'


export default function ConfigurationArchivedTasks() {

  const tasks = useContext(TasksContext)

  const restoreArchivedTasks = () => {
    tasks.restoreArchivedTasks()
    tasks.setConfigurationMode(false)
  }

  const deleteArchivedTasks = () => {
    tasks.cleanArchivedTasks()
    tasks.setConfigurationMode(false)
  }

  return (
    <>
      <h3>Archived tasks</h3>
      <p>
        You can restore archived tasks by clicking on the button below.
      </p>
      <button onClick={restoreArchivedTasks} className='simpleButton'>
        Restore archived tasks
      </button>

      <p>
        You can also delete all archived tasks by clicking on the button below.
      </p>
      <button onClick={deleteArchivedTasks} className='simpleButton secondary'>
        Delete archived tasks
      </button>
    </>
  )
}