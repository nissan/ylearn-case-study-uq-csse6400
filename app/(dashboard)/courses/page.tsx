"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCoursesForUser, type Course } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  useEffect(() => {
    if (user) {
      const userCourses = getCoursesForUser(user.role, user.id)
      setCourses(userCourses)
      setFilteredCourses(userCourses)
    }
  }, [user])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses)
    } else {
      const filtered = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCourses(filtered)
    }
  }, [searchTerm, courses])

  if (!user) return null

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          {user.role === "student" ? "Your enrolled courses" : "Courses you're teaching"}
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="w-full md:w-1/3">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {user.role === "instructor" || user.role === "admin" ? <Button>Create New Course</Button> : null}
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>

          <p className="text-sm text-muted-foreground">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.name}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription>
                      {course.code} - {course.term}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex justify-between">
                    <p className="text-sm">
                      <span className="font-medium">Instructor:</span> {course.instructor}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Credits:</span> {course.credits}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 font-medium border-b">
              <div className="col-span-2">Course</div>
              <div>Instructor</div>
              <div>Term</div>
              <div>Credits</div>
            </div>
            {filteredCourses.map((course) => (
              <div key={course.id} className="grid grid-cols-5 p-4 hover:bg-muted/50 items-center">
                <div className="col-span-2">
                  <div className="font-medium">{course.name}</div>
                  <div className="text-sm text-muted-foreground">{course.code}</div>
                </div>
                <div>{course.instructor}</div>
                <div>{course.term}</div>
                <div className="flex items-center justify-between">
                  <span>{course.credits}</span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/courses/${course.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
