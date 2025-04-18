"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  BookOpen,
  ChevronDown,
  Code2,
  ExternalLink,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Percent,
  Settings,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ElementType
    roles?: UserRole[]
    isExternal?: boolean
  }[]
}

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const { user, logout, switchRole } = useAuth()

  if (!user) return null

  const sidebarNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      title: "Grades",
      href: "/grades",
      icon: Percent,
    },
    {
      title: "Assessments",
      href: "/assessments",
      icon: GraduationCap,
    },
    {
      title: "Architecture",
      href: "/architecture",
      icon: BarChart,
      // This is a public page, but we'll still show it in the sidebar
      isExternal: true, // Add this property to indicate it's an external link
    },
    {
      title: "Dev Portal",
      href: "/dev-portal",
      icon: Code2,
      roles: ["instructor", "admin"],
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="absolute left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <MobileSidebar
            items={sidebarNavItems}
            setOpen={setOpen}
            user={user}
            logout={logout}
            switchRole={switchRole}
          />
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-screen flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6" />
              <span className="text-lg">
                y<span className="text-primary">Learn</span>
              </span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <SidebarNav items={sidebarNavItems} className="p-2" />
          </ScrollArea>
          <div className="border-t p-4">
            <UserMenu user={user} logout={logout} switchRole={switchRole} />
          </div>
        </div>
      </div>
    </>
  )
}

function MobileSidebar({
  items,
  setOpen,
  user,
  logout,
  switchRole,
}: {
  items: SidebarNavProps["items"]
  setOpen: (open: boolean) => void
  user: NonNullable<ReturnType<typeof useAuth>["user"]>
  logout: () => void
  switchRole: (role: UserRole) => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span className="text-lg">
            y<span className="text-primary">Learn</span>
          </span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <SidebarNav items={items} className="p-2" />
      </ScrollArea>
      <div className="border-t p-4">
        <UserMenu user={user} logout={logout} switchRole={switchRole} />
      </div>
    </div>
  )
}

function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item) => {
        // Skip items that are role-restricted and user doesn't have access
        if (item.roles && !item.roles.includes(user.role)) {
          return null
        }

        const isActive = pathname === item.href

        return (
          <>
            {item.isExternal ? (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
                <ExternalLink className="ml-auto h-4 w-4" />
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )}
          </>
        )
      })}
    </nav>
  )
}

function UserMenu({
  user,
  logout,
  switchRole,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>
  logout: () => void
  switchRole: (role: UserRole) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => switchRole("student")}>
            <span>Student</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole("instructor")}>
            <span>Instructor</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole("admin")}>
            <span>Admin</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />
    </div>
  )
}
