"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockCourses, getAssessmentsForCourse, type Course, type Assessment } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Clock, Download, FileText, GraduationCap, MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      // Find the course
      const foundCourse = mockCourses.find((c) => c.id === params.id)
      setCourse(foundCourse || null)

      // Get assessments for this course
      if (foundCourse) {
        const courseAssessments = getAssessmentsForCourse(foundCourse.id)
        setAssessments(courseAssessments)
      }

      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Calculate course progress for students
  const completedAssessments = assessments.filter((a) => a.status === "graded" || a.status === "submitted").length
  const totalAssessments = assessments.length
  const progressPercentage = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0

  return (
    <div className="container py-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/courses" className="text-muted-foreground hover:text-foreground">
            Courses
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>{course.code}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
            <p className="text-muted-foreground">
              {course.code} - {course.term}
            </p>
          </div>
          {user.role === "instructor" || user.role === "admin" ? <Button>Edit Course</Button> : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{course.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Instructor</p>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Term</p>
                    <p className="text-sm text-muted-foreground">{course.term}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Credits</p>
                    <p className="text-sm text-muted-foreground">{course.credits}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Materials</p>
                    <p className="text-sm text-muted-foreground">12 resources available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="assessments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
            </TabsList>

            <TabsContent value="assessments" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium border-b">
                  <div className="col-span-2">Assessment</div>
                  <div>Type</div>
                  <div>Due Date</div>
                  <div>Status</div>
                </div>
                {assessments.length > 0 ? (
                  assessments.map((assessment) => (
                    <div key={assessment.id} className="grid grid-cols-5 p-4 hover:bg-muted/50 items-center">
                      <div className="col-span-2">
                        <div className="font-medium">{assessment.title}</div>
                        <div className="text-sm text-muted-foreground">Weight: {assessment.weight}%</div>
                      </div>
                      <div className="capitalize">{assessment.type}</div>
                      <div>{new Date(assessment.dueDate).toLocaleDateString()}</div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            assessment.status === "graded"
                              ? "default"
                              : assessment.status === "submitted"
                                ? "secondary"
                                : assessment.status === "open"
                                  ? "outline"
                                  : assessment.status === "late"
                                    ? "destructive"
                                    : "outline"
                          }
                          className="capitalize"
                        >
                          {assessment.status}
                        </Badge>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/assessments/${assessment.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No assessments available for this course.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Materials</CardTitle>
                  <CardDescription>Access lecture slides, readings, and other resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-4 font-medium border-b">
                        <div className="col-span-2">Title</div>
                        <div>Type</div>
                        <div>Actions</div>
                      </div>

                      <div className="grid grid-cols-4 p-4 hover:bg-muted/50 items-center">
                        <div className="col-span-2">
                          <div className="font-medium">Course Syllabus</div>
                          <div className="text-sm text-muted-foreground">Updated 2 weeks ago</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>PDF</span>
                        </div>
                        <div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 p-4 hover:bg-muted/50 items-center">
                        <div className="col-span-2">
                          <div className="font-medium">Week 1: Introduction</div>
                          <div className="text-sm text-muted-foreground">Lecture slides</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>PPTX</span>
                        </div>
                        <div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 p-4 hover:bg-muted/50 items-center">
                        <div className="col-span-2">
                          <div className="font-medium">Required Reading</div>
                          <div className="text-sm text-muted-foreground">Chapter 1-3</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>PDF</span>
                        </div>
                        <div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forum" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forum</CardTitle>
                  <CardDescription>Engage with your instructor and peers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[200px] items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Forum view coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 space-y-6">
          {user.role === "student" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Completed</span>
                    <span>
                      {completedAssessments} of {totalAssessments} assessments
                    </span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>

                <div className="pt-4 space-y-4">
                  <h4 className="text-sm font-medium">Next Due</h4>
                  {assessments
                    .filter((a) => a.status !== "graded" && a.status !== "submitted")
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 1)
                    .map((assessment) => (
                      <div key={assessment.id} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{assessment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due {new Date(assessment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(user.role === "instructor" || user.role === "admin") && (
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
                <Button className="w-full" variant="outline">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Create Assessment
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Materials
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Announcement
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Course Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Lecture</p>
                    <p className="text-xs text-muted-foreground">Monday, 10:00 AM - 12:00 PM</p>
                    <p className="text-xs text-muted-foreground">Room: Engineering E101</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tutorial</p>
                    <p className="text-xs text-muted-foreground">Wednesday, 2:00 PM - 3:00 PM</p>
                    <p className="text-xs text-muted-foreground">Room: Engineering E105</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Lab Session</p>
                    <p className="text-xs text-muted-foreground">Friday, 1:00 PM - 3:00 PM</p>
                    <p className="text-xs text-muted-foreground">Room: Computer Lab C201</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
