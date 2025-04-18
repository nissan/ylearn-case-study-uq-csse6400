"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockAssessments, mockCourses, type Assessment, type Course } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, Calendar, Check, Clock, Download, FileText, Upload } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function AssessmentDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [submissionText, setSubmissionText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      // Find the assessment
      const foundAssessment = mockAssessments.find((a) => a.id === params.id)
      setAssessment(foundAssessment || null)

      // Find the course
      if (foundAssessment) {
        const foundCourse = mockCourses.find((c) => c.id === foundAssessment.courseId)
        setCourse(foundCourse || null)
      }

      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessment || !course) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <h1 className="text-2xl font-bold">Assessment not found</h1>
          <p className="text-muted-foreground mb-4">
            The assessment you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link href="/assessments">Back to Assessments</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!user) return null

  const dueDate = new Date(assessment.dueDate)
  const isOverdue = new Date() > dueDate
  const canSubmit = assessment.status === "open" && !isOverdue

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSubmit || !submissionText.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update assessment status (in a real app, this would be done via API)
    setAssessment({
      ...assessment,
      status: "submitted",
      submissionDate: new Date().toISOString(),
    })

    setIsSubmitting(false)
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/assessments" className="text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Assessments
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{assessment.title}</h1>
            <p className="text-muted-foreground">
              {course.code} - {course.name}
            </p>
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
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{assessment.description}</p>

              {assessment.status === "graded" && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Feedback</h3>
                    <p className="text-muted-foreground">{assessment.feedback || "No feedback provided."}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">
                        {assessment.score} / {assessment.maxScore}
                      </div>
                      <div className="flex-1">
                        <Progress value={(assessment.score! / assessment.maxScore) * 100} />
                      </div>
                      <div className="text-lg font-medium">
                        {Math.round((assessment.score! / assessment.maxScore) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {user.role === "student" && (
            <Card>
              <CardHeader>
                <CardTitle>Submission</CardTitle>
                <CardDescription>
                  {assessment.status === "submitted" || assessment.status === "graded"
                    ? "Your submission has been recorded"
                    : canSubmit
                      ? "Submit your work before the deadline"
                      : "Submission is no longer available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assessment.status === "open" && (
                  <>
                    {isOverdue ? (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Submission Closed</AlertTitle>
                        <AlertDescription>The deadline for this assessment has passed.</AlertDescription>
                      </Alert>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Enter your submission text or notes here..."
                            className="min-h-[200px]"
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <Button type="button" variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                          </Button>

                          <Button type="submit" disabled={isSubmitting || !submissionText.trim()}>
                            {isSubmitting ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Submit Assessment
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </>
                )}

                {(assessment.status === "submitted" || assessment.status === "graded") && (
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <p className="font-medium">
                          Submitted on {new Date(assessment.submissionDate!).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-muted-foreground">
                        Your submission has been recorded.{" "}
                        {assessment.status === "submitted" ? "It is currently being reviewed." : "It has been graded."}
                      </p>
                    </div>

                    {assessment.plagiarismScore !== undefined && (
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">TurnItIn Similarity Score</p>
                          <Badge variant={assessment.plagiarismScore < 15 ? "outline" : "destructive"}>
                            {assessment.plagiarismScore}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {assessment.plagiarismScore < 15
                            ? "Your submission has a low similarity score, which is good."
                            : "Your submission has a high similarity score. Please review university policies on academic integrity."}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Submission
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(user.role === "instructor" || user.role === "admin") && (
            <Tabs defaultValue="submissions" className="space-y-4">
              <TabsList>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="submissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                    <CardDescription>Review and grade student work</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[200px] items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Submissions view coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Analytics</CardTitle>
                    <CardDescription>View statistics and performance data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[200px] items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Analytics view coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-muted-foreground">
                      {dueDate.toLocaleDateString()} at{" "}
                      {dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{assessment.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">{assessment.weight}% of final grade</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Assessment Guidelines
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Rubric
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
            </CardHeader>
            <CardContent>
              {assessment.submissionDate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Final Submission</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(assessment.submissionDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
