import React from 'react'
import CleanerCompleted from './components/CleanerCompleted'
import FilterBar from './components/FilterBar'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import TasksProvider from './components/TasksProvider'

function App() {

  return (
    <TasksProvider>
      <main className="App">
        <h1>Todo List</h1>
        <TaskInput />
        <FilterBar />
        <TaskList />
        <CleanerCompleted />
      </main>
    </TasksProvider>
  )
}

export default App
