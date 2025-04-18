"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCoursesForUser, getGradesForStudent, mockCourses, type Course, type Grade } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function GradesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const userCourses = getCoursesForUser(user.role, user.id)
      setCourses(userCourses)

      if (user.role === "student") {
        const studentGrades = getGradesForStudent(user.id)
        setGrades(studentGrades)
      }

      // Set the first course as selected by default
      if (userCourses.length > 0 && !selectedCourse) {
        setSelectedCourse(userCourses[0].id)
      }
    }
  }, [user, selectedCourse])

  if (!user) return null

  // Calculate overall GPA and course grades
  const calculateGradeData = () => {
    const courseGrades: Record<string, { total: number; max: number; percentage: number }> = {}

    grades.forEach((grade) => {
      if (!courseGrades[grade.courseId]) {
        courseGrades[grade.courseId] = { total: 0, max: 0, percentage: 0 }
      }

      courseGrades[grade.courseId].total += grade.score
      courseGrades[grade.courseId].max += grade.maxScore
    })

    // Calculate percentages
    Object.keys(courseGrades).forEach((courseId) => {
      const { total, max } = courseGrades[courseId]
      courseGrades[courseId].percentage = max > 0 ? (total / max) * 100 : 0
    })

    // Calculate overall GPA (simplified)
    let overallTotal = 0
    let overallMax = 0

    Object.values(courseGrades).forEach(({ total, max }) => {
      overallTotal += total
      overallMax += max
    })

    const overallPercentage = overallMax > 0 ? (overallTotal / overallMax) * 100 : 0
    const gpa = calculateGPA(overallPercentage)

    return { courseGrades, overallPercentage, gpa }
  }

  const { courseGrades, overallPercentage, gpa } = calculateGradeData()

  // Helper function to convert percentage to letter grade and GPA
  function calculateGPA(percentage: number): { letter: string; value: number } {
    if (percentage >= 90) return { letter: "A+", value: 4.0 }
    if (percentage >= 85) return { letter: "A", value: 4.0 }
    if (percentage >= 80) return { letter: "A-", value: 3.7 }
    if (percentage >= 75) return { letter: "B+", value: 3.3 }
    if (percentage >= 70) return { letter: "B", value: 3.0 }
    if (percentage >= 65) return { letter: "B-", value: 2.7 }
    if (percentage >= 60) return { letter: "C+", value: 2.3 }
    if (percentage >= 55) return { letter: "C", value: 2.0 }
    if (percentage >= 50) return { letter: "C-", value: 1.7 }
    if (percentage >= 45) return { letter: "D+", value: 1.3 }
    if (percentage >= 40) return { letter: "D", value: 1.0 }
    return { letter: "F", value: 0.0 }
  }

  // Function to export grades as CSV
  const exportGradesCSV = () => {
    if (grades.length === 0) return

    // Create CSV content
    const headers = ["Course", "Assessment", "Score", "Max Score", "Percentage", "Submission Date", "Graded Date"]
    const rows = grades.map((grade) => {
      const course = mockCourses.find((c) => c.id === grade.courseId)
      const percentage = ((grade.score / grade.maxScore) * 100).toFixed(2)

      return [
        course?.name || "Unknown",
        "Assessment", // We don't have assessment titles in the grades data
        grade.score,
        grade.maxScore,
        `${percentage}%`,
        new Date(grade.submissionDate).toLocaleDateString(),
        grade.gradedDate ? new Date(grade.gradedDate).toLocaleDateString() : "N/A",
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "grades.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
        <p className="text-muted-foreground">
          {user.role === "student" ? "View your grades and academic progress" : "Manage and view student grades"}
        </p>
      </div>

      {user.role === "student" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gpa.value.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Letter Grade: {gpa.letter}</p>
              <div className="mt-2">
                <Progress value={overallPercentage} />
              </div>
            </CardContent>
          </Card>

          {Object.entries(courseGrades).map(([courseId, { percentage }]) => {
            const course = mockCourses.find((c) => c.id === courseId)
            const gradeInfo = calculateGPA(percentage)

            return (
              <Card key={courseId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{course?.code || "Unknown Course"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{gradeInfo.letter}</div>
                  <p className="text-xs text-muted-foreground">
                    {percentage.toFixed(2)}% - GPA: {gradeInfo.value.toFixed(2)}
                  </p>
                  <div className="mt-2">
                    <Progress value={percentage} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <Tabs
          defaultValue={selectedCourse || "all"}
          className="w-full"
          onValueChange={(value) => setSelectedCourse(value === "all" ? null : value)}
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-4 w-fit">
              <TabsTrigger value="all">All Courses</TabsTrigger>
              {courses.slice(0, 3).map((course) => (
                <TabsTrigger key={course.id} value={course.id}>
                  {course.code}
                </TabsTrigger>
              ))}
            </TabsList>

            <Button variant="outline" onClick={exportGradesCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Grades</CardTitle>
                <CardDescription>View grades across all your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Max Score</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Submission Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.length > 0 ? (
                      grades.map((grade) => {
                        const course = mockCourses.find((c) => c.id === grade.courseId)
                        const percentage = ((grade.score / grade.maxScore) * 100).toFixed(2)

                        return (
                          <TableRow key={grade.id}>
                            <TableCell>{course?.code || "Unknown"}</TableCell>
                            <TableCell>Assessment</TableCell>
                            <TableCell>{grade.score}</TableCell>
                            <TableCell>{grade.maxScore}</TableCell>
                            <TableCell>{percentage}%</TableCell>
                            <TableCell>{new Date(grade.submissionDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No grades available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {courses.map((course) => (
            <TabsContent key={course.id} value={course.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>
                    {course.code} - {course.term}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Max Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades
                        .filter((grade) => grade.courseId === course.id)
                        .map((grade) => {
                          const percentage = ((grade.score / grade.maxScore) * 100).toFixed(2)

                          return (
                            <TableRow key={grade.id}>
                              <TableCell>Assessment</TableCell>
                              <TableCell>{grade.score}</TableCell>
                              <TableCell>{grade.maxScore}</TableCell>
                              <TableCell>{percentage}%</TableCell>
                              <TableCell>{new Date(grade.submissionDate).toLocaleDateString()}</TableCell>
                              <TableCell>{grade.feedback || "No feedback"}</TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
