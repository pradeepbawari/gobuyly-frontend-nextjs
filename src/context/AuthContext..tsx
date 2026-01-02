'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  address?: string
  mobile_number?:number
  gst?:any
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User, token?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (userData: User, token?: string) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))

    if (token) {
      localStorage.setItem('token', token)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
