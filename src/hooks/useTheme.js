import { useEffect, useState } from 'react'

export default function useTheme() {

  const [theme, setTheme] = useState(false)

  useEffect(() => {
    const localStorageTheme = localStorage.getItem('theme')
    if (localStorageTheme) {
      setTheme(JSON.parse(localStorageTheme))
    }
  }, [])

  const compactMode = theme.compactMode 

  const setCompactMode = (value) => {
    setTheme({...theme, compactMode: value})
    localStorage.setItem('theme', JSON.stringify({...theme, compactMode: value}))
  }

  return [compactMode, setCompactMode]

}