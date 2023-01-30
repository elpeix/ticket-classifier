import React, { createContext } from 'react'
import Container from './components/Container'
import TasksProvider from './components/TasksProvider'
import useToken from './hooks/useToken'


export const AppContext = createContext()

export default function App() {

  const [token, setToken] = useToken()

  return (
    <AppContext.Provider value={{ token, setToken }}>
      <main className="App">
        <h1>Todo List</h1>
        <TasksProvider token={token}>
          <Container />
        </TasksProvider>
      </main>
    </AppContext.Provider>
  )
}
