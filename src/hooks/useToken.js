import { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()
const COHERE_TOKEN = 'cohereToken'

export default function useToken() {
  
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = cookies.get(COHERE_TOKEN)
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const saveToken = (token) => {
    setToken(token)
    const tokenExpiration = new Date().getTime() + 1000 * 60 * 60 * 24 * 7
    cookies.set(COHERE_TOKEN, token, { 
      expires: new Date(tokenExpiration),
      path: '/',
      sameSite: 'strict'
    })
  }

  return [token, saveToken]

}