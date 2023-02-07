import React, { createContext } from 'react'
import TaskApp from './components/TaskApp'
import useLogin from './hooks/useLogin'



export const LoginContext = createContext()

export default function App() {

  const [isLoggedIn, login, logout] = useLogin()

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      <TaskApp />
    </LoginContext.Provider>
  )

}
