"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "student" | "instructor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  student: {
    id: "s12345",
    name: "Alex Student",
    email: "alex@university.edu",
    role: "student",
    avatar: "/abstract-geometric-shapes.png",
  },
  instructor: {
    id: "i67890",
    name: "Dr. Jamie Professor",
    email: "jamie@university.edu",
    role: "instructor",
    avatar: "/stylized-jp-initials.png",
  },
  admin: {
    id: "a24680",
    name: "Sam Admin",
    email: "sam@university.edu",
    role: "admin",
    avatar: "/abstract-geometric-shapes.png",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("ylearn-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple mock login logic
    let role: UserRole = "student"
    if (email.includes("admin")) {
      role = "admin"
    } else if (email.includes("professor") || email.includes("instructor")) {
      role = "instructor"
    }

    const loggedInUser = mockUsers[role]
    setUser(loggedInUser)
    localStorage.setItem("ylearn-user", JSON.stringify(loggedInUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ylearn-user")
  }

  const switchRole = (role: UserRole) => {
    const newUser = mockUsers[role]
    setUser(newUser)
    localStorage.setItem("ylearn-user", JSON.stringify(newUser))
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
