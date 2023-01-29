import React, { useContext } from 'react'
import CleanerCompleted from './CleanerCompleted'
import ExampleGenerator from './ExampleGenerator'
import FilterBar from './FilterBar'
import TaskInput from './TaskInput'
import TaskList from './TaskList'
import { TasksContext } from './TasksProvider'

export default function Container () {

  const tasks = useContext(TasksContext)
  const examplesIsEmpty = tasks.examplesIsEmpty()

  return (
    <>
      { examplesIsEmpty && <ExampleGenerator />}
      { !examplesIsEmpty && (
        <>
          <TaskInput />
          <FilterBar />
          <TaskList />
          <CleanerCompleted />
        </>
      )}
    </>
  )
}