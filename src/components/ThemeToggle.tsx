'use client'

import { useTheme } from '@/context/ThemeContext'
import { motion } from 'framer-motion'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme, theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'system') {
      // If system, switch to opposite of current resolved
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      // Toggle between light and dark
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-9 h-9" />
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: resolvedTheme === 'dark' ? 0 : 180,
          scale: 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {resolvedTheme === 'dark' ? (
          <FaMoon className="w-5 h-5 text-yellow-400" />
        ) : (
          <FaSun className="w-5 h-5 text-orange-500" />
        )}
      </motion.div>
    </motion.button>
  )
}

