"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getCoursesForUser,
  getNotificationsForUser,
  mockAssessments,
  type Course,
  type Assessment,
  type Notification,
} from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bell, BookOpen, Calendar, CheckCircle, Clock, GraduationCap } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [upcomingAssessments, setUpcomingAssessments] = useState<Assessment[]>([])

  useEffect(() => {
    if (user) {
      // Load user-specific data
      const userCourses = getCoursesForUser(user.role, user.id)
      setCourses(userCourses)

      const userNotifications = getNotificationsForUser(user.id)
      setNotifications(userNotifications)

      // Get upcoming assessments (due in the next 14 days)
      const now = new Date()
      const twoWeeksFromNow = new Date()
      twoWeeksFromNow.setDate(now.getDate() + 14)

      const upcoming = mockAssessments
        .filter((assessment) => {
          const dueDate = new Date(assessment.dueDate)
          return dueDate > now && dueDate <= twoWeeksFromNow && assessment.status !== "graded"
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5)

      setUpcomingAssessments(upcoming)
    }
  }, [user])

  if (!user) return null

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Here's what's happening in your courses</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
                <p className="text-xs text-muted-foreground">
                  {user.role === "student" ? "Enrolled" : "Teaching"} this semester
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Assessments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAssessments.length}</div>
                <p className="text-xs text-muted-foreground">Due in the next 14 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {user.role === "student" ? "Completed" : "Graded"}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAssessments.filter((a) => a.status === "graded").length}</div>
                <p className="text-xs text-muted-foreground">
                  {user.role === "student" ? "Assessments submitted" : "Assessments reviewed"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.filter((n) => !n.read).length}</div>
                <p className="text-xs text-muted-foreground">Unread notifications</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Assessments</CardTitle>
                <CardDescription>Assessments due in the next 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAssessments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAssessments.map((assessment) => {
                      const course = courses.find((c) => c.id === assessment.courseId)
                      const dueDate = new Date(assessment.dueDate)

                      return (
                        <div key={assessment.id} className="flex items-center">
                          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {assessment.type === "assignment" && <GraduationCap className="h-5 w-5 text-primary" />}
                            {assessment.type === "quiz" && <Clock className="h-5 w-5 text-primary" />}
                            {assessment.type === "exam" && <GraduationCap className="h-5 w-5 text-primary" />}
                            {assessment.type === "project" && <GraduationCap className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{assessment.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {course?.code} - Due {dueDate.toLocaleDateString()} at{" "}
                              {dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/assessments/${assessment.id}`}>View</Link>
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming assessments.</p>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Your latest updates and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 h-2 w-2 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`}
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No notifications.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
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
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View your upcoming deadlines and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
