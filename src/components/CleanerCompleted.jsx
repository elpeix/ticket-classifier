import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'

export default function CleanerCompleted() {

  const tasks = useContext(TasksContext)

  const showCleaner = tasks.totals.completed > 0 
                   && tasks.tasks.some(task => task.completed)

  return (
    <>
      { showCleaner && (
        <button onClick={tasks.cleanCompletedTasks}>
          Clean completed tasks
        </button>
      )}
    </>
  )
}