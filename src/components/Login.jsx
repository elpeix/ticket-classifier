import React, { useContext, useState } from 'react'
import { LoginContext } from '../App'
import styles from '../styles/Login.module.css'

export default function Login() {

  const login = useContext(LoginContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const handleLogin = (e) => {
    e.preventDefault()
    if (username === '' || password === '') {
      return
    }
    login.login(username, password)
  }

  return (
    <div className="App">
      <h1>Todo List</h1>
      <p>You need to login to use this app</p>
      <form className={styles.form} onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}