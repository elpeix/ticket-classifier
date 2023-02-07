import React, { createContext } from 'react'
import TaskApp from './components/TaskApp'
import useLogin from './hooks/useLogin'



export const LoginContext = createContext()

export default function App() {

  const [isLoggedIn, login, logout] = useLogin()

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      <main className="App">
        <h1>Todo List</h1>
        <TaskApp />
      </main>
      <footer>
        <p>
          {new Date().getFullYear()} {' - '}
          <a href="https://github.com/elpeix" target="_blank" rel="noreferrer">
            elPeix
          </a>
        </p>
      </footer>
    </LoginContext.Provider>
  )

}
