import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'

export default function CleanerCompleted() {

  const tasks = useContext(TasksContext)

  return (
    <>
      { tasks.tasks.length > 0 && (
        <button onClick={tasks.cleanCompletedTasks}>
          Clean completed tasks
        </button>
      )}
    </>
  )
}