import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'bu-market-theme'
const LIGHT = 'bumarket'
const DARK = 'bumarket-dark'

function getInitialTheme() {
  if (typeof window === 'undefined') return LIGHT
  return localStorage.getItem(THEME_KEY) || LIGHT
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === DARK ? LIGHT : DARK)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === DARK, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme doit être utilisé dans ThemeProvider')
  return context
}
