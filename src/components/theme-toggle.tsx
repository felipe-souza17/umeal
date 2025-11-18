'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const theme = localStorage.getItem('theme') || 'dark'
    setIsDark(theme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-border"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
