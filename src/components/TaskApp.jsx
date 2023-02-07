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
          <TasksProvider token={token}>
            <Container />
          </TasksProvider>
        </AppContext.Provider>
      )}
      {!login.isLoggedIn && (
        <Login />
      )}
    </>
  )
}

