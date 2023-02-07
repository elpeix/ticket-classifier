import React, { createContext, useContext } from 'react'
import { LoginContext } from '../App'
import useToken from '../hooks/useToken'
import Container from './Container'
import Login from './Login'
import TasksProvider from './TasksProvider'

export const AppContext = createContext()

export default function TaskApp() {

  const [token, setToken] = useToken()
  const login = useContext(LoginContext)

  return (
    <>
      {login.isLoggedIn && (
        <AppContext.Provider value={{ token, setToken }}>
          <main className="App">
            <h1>Todo List</h1>
            <TasksProvider token={token}>
              <Container />
            </TasksProvider>
          </main>
          <footer>
            <p>
              {new Date().getFullYear()} {' - '}
              <a href="https://github.com/elpeix" target="_blank" rel="noreferrer">
                elPeix
              </a>
            </p>
          </footer>
        </AppContext.Provider>
      )}
      {!login.isLoggedIn && (
        <Login />
      )}
    </>
  )
}

