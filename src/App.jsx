import React from 'react'
import Container from './components/Container'
import TasksProvider from './components/TasksProvider'

function App() {

  return (
    <TasksProvider>
      <main className="App">
        <h1>Todo List</h1>
        <Container />
      </main>
    </TasksProvider>
  )
}

export default App
