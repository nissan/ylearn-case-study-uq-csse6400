"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockAssessments, mockCourses, type Assessment, type Course } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, CheckCircle, Clock, FileText, GraduationCap, Search } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AssessmentsPage() {
  const { user } = useAuth()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])

  useEffect(() => {
    if (user) {
      // In a real app, we would filter assessments based on user's courses
      setAssessments(mockAssessments)
      setCourses(mockCourses)
    }
  }, [user])

  useEffect(() => {
    if (assessments.length > 0) {
      let filtered = [...assessments]

      // Apply search filter
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter(
          (assessment) =>
            assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assessment.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((assessment) => assessment.status === statusFilter)
      }

      // Apply type filter
      if (typeFilter !== "all") {
        filtered = filtered.filter((assessment) => assessment.type === typeFilter)
      }

      setFilteredAssessments(filtered)
    }
  }, [assessments, searchTerm, statusFilter, typeFilter])

  if (!user) return null

  // Group assessments by status
  const upcomingAssessments = filteredAssessments.filter((a) => a.status === "upcoming")
  const openAssessments = filteredAssessments.filter((a) => a.status === "open")
  const submittedAssessments = filteredAssessments.filter((a) => a.status === "submitted")
  const gradedAssessments = filteredAssessments.filter((a) => a.status === "graded")
  const lateAssessments = filteredAssessments.filter((a) => a.status === "late")

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">
          {user.role === "student"
            ? "View and submit your assignments, quizzes, and exams"
            : "Manage and grade student assessments"}
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search assessments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="all" onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select defaultValue="all" onValueChange={setTypeFilter}>
              <SelectTrigger id="type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(user.role === "instructor" || user.role === "admin") && <Button>Create Assessment</Button>}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAssessments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  course={courses.find((c) => c.id === assessment.courseId)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No assessments found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAssessments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  course={courses.find((c) => c.id === assessment.courseId)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No upcoming assessments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          {openAssessments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {openAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  course={courses.find((c) => c.id === assessment.courseId)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No open assessments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssessments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {submittedAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  course={courses.find((c) => c.id === assessment.courseId)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <CheckCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No submitted assessments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedAssessments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gradedAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  course={courses.find((c) => c.id === assessment.courseId)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <GraduationCap className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No graded assessments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AssessmentCard({
  assessment,
  course,
}: {
  assessment: Assessment
  course?: Course
}) {
  const dueDate = new Date(assessment.dueDate)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assessment.title}</CardTitle>
            <CardDescription>
              {course?.code} - {course?.name}
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{assessment.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium">Due Date</p>
            <p className="text-muted-foreground">
              {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div>
            <p className="font-medium">Type</p>
            <p className="text-muted-foreground capitalize">{assessment.type}</p>
          </div>

          <div>
            <p className="font-medium">Weight</p>
            <p className="text-muted-foreground">{assessment.weight}%</p>
          </div>

          <div>
            <p className="font-medium">Max Score</p>
            <p className="text-muted-foreground">{assessment.maxScore} points</p>
          </div>
        </div>

        {assessment.status === "graded" && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <p className="font-medium">Your Score</p>
              <p className="font-medium">
                {assessment.score} / {assessment.maxScore}
              </p>
            </div>
            <div className="mt-1">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(assessment.score! / assessment.maxScore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <div className="px-6 pb-6">
        <Button asChild className="w-full">
          <Link href={`/assessments/${assessment.id}`}>{assessment.status === "open" ? "Submit" : "View Details"}</Link>
        </Button>
      </div>
    </Card>
  )
}
