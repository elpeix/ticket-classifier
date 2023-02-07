import { useEffect, useState } from 'react'
import sha256 from 'crypto-js/sha256'

export default function useLogin() {

  const [isLoggedIn, setLogin] = useState(false)

  useEffect(() => {
    const credentials = localStorage.getItem('credentials')
    if (credentials) {
      const { username, password } = JSON.parse(credentials)
      login(username, password)
    }
  }, [])

  const login = (username, password) => {
    const hash = sha256(username + password).toString()
    if (hash === '4a10ba2b2c9538846edae2e4e0a4852d77cbe665239006b71e096a128d756d56') {
      setLogin(true)
      localStorage.setItem('credentials', JSON.stringify({ username, password }))
    } else {
      setLogin(false)
    }
  }

  const logout = () => {
    setLogin(false)
  }

  return [isLoggedIn, login, logout]

}