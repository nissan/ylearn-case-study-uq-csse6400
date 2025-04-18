"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Check, Copy, Lock, RefreshCw, Search, Settings, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { redirect } from "next/navigation"

export default function DevPortalPage() {
  const { user } = useAuth()
  const [apiKey, setApiKey] = useState("ylearn_sk_12345678901234567890")
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Only instructors and admins can access the dev portal
  if (user?.role === "student") {
    redirect("/dashboard")
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const regenerateApiKey = async () => {
    setGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a new random API key
    const newKey =
      "ylearn_sk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setApiKey(newKey)
    setGenerating(false)
  }

  if (!user) return null

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Developer Portal</h1>
        <p className="text-muted-foreground">Connect your tools and applications to yLearn</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Developer Access</AlertTitle>
        <AlertDescription>
          This portal allows you to integrate your applications with yLearn's APIs. Keep your API keys secure and never
          share them publicly.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for accessing yLearn services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-medium">Primary API Key</p>
                    <div className="flex items-center mt-1">
                      <Input value={apiKey} readOnly type="password" className="font-mono" />
                      <Button variant="ghost" size="icon" onClick={copyApiKey} className="ml-2">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy API key</span>
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" onClick={regenerateApiKey} disabled={generating}>
                    {generating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Access Permissions</h3>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Course Data</p>
                        <p className="text-sm text-muted-foreground">Access course information and materials</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Assessment Data</p>
                        <p className="text-sm text-muted-foreground">Access assessment information and submissions</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Grade Data</p>
                        <p className="text-sm text-muted-foreground">Access grade information</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">User Data</p>
                        <p className="text-sm text-muted-foreground">Access user profiles and information</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="documentation" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documentation">API Documentation</TabsTrigger>
              <TabsTrigger value="examples">Code Examples</TabsTrigger>
              <TabsTrigger value="logs">API Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="documentation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Explore the available endpoints and how to use them</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search endpoints..." />
                      <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div>
                          <p className="font-medium">GET /api/courses</p>
                          <p className="text-sm text-muted-foreground">Retrieve a list of courses</p>
                        </div>
                        <Badge>GET</Badge>
                      </div>

                      <div className="p-4">
                        <h4 className="font-medium mb-2">Parameters</h4>
                        <div className="space-y-2 mb-4">
                          <div className="grid grid-cols-3 text-sm">
                            <div className="font-medium">term</div>
                            <div>string</div>
                            <div className="text-muted-foreground">Filter by term (optional)</div>
                          </div>
                          <div className="grid grid-cols-3 text-sm">
                            <div className="font-medium">limit</div>
                            <div>integer</div>
                            <div className="text-muted-foreground">Number of results (default: 10)</div>
                          </div>
                        </div>

                        <h4 className="font-medium mb-2">Response</h4>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {`{
  "courses": [
    {
      "id": "course-1",
      "code": "CSSE6400",
      "name": "Software Architecture",
      "description": "Learn about software architecture patterns and practices",
      "instructor": "Dr. Jamie Professor",
      "term": "Semester 1, 2023",
      "credits": 4
    },
    // More courses...
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div>
                          <p className="font-medium">GET /api/courses/{"{id}"}</p>
                          <p className="text-sm text-muted-foreground">Retrieve a specific course</p>
                        </div>
                        <Badge>GET</Badge>
                      </div>

                      <div className="p-4">
                        <h4 className="font-medium mb-2">Parameters</h4>
                        <div className="space-y-2 mb-4">
                          <div className="grid grid-cols-3 text-sm">
                            <div className="font-medium">id</div>
                            <div>string</div>
                            <div className="text-muted-foreground">Course ID (required)</div>
                          </div>
                        </div>

                        <h4 className="font-medium mb-2">Response</h4>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {`{
  "id": "course-1",
  "code": "CSSE6400",
  "name": "Software Architecture",
  "description": "Learn about software architecture patterns and practices",
  "instructor": "Dr. Jamie Professor",
  "term": "Semester 1, 2023",
  "credits": 4,
  "assessments": [
    {
      "id": "assessment-1",
      "title": "Architecture Design Document",
      "dueDate": "2023-04-15T23:59:59",
      "type": "assignment",
      "weight": 30
    },
    // More assessments...
  ]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>Sample code for integrating with yLearn APIs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript">
                    <TabsList className="mb-4">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>

                    <TabsContent value="javascript">
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                        {`// Fetch courses using the yLearn API
const fetchCourses = async () => {
  try {
    const response = await fetch('https://api.ylearn.edu/courses', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ${apiKey}',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const data = await response.json();
    console.log('Courses:', data.courses);
    return data.courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Submit an assessment
const submitAssessment = async (assessmentId, submission) => {
  try {
    const response = await fetch(\`https://api.ylearn.edu/assessments/\${assessmentId}/submit\`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ${apiKey}',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ submission })
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }
    
    const data = await response.json();
    console.log('Submission result:', data);
    return data;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
};`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="python">
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                        {`import requests

API_KEY = "${apiKey}"
BASE_URL = "https://api.ylearn.edu"

def fetch_courses():
    """Fetch all courses from the yLearn API."""
    try:
        response = requests.get(
            f"{BASE_URL}/courses",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            }
        )
        response.raise_for_status()
        data = response.json()
        print(f"Fetched {len(data['courses'])} courses")
        return data['courses']
    except requests.exceptions.RequestException as e:
        print(f"Error fetching courses: {e}")
        return []

def submit_assessment(assessment_id, submission):
    """Submit an assessment to the yLearn API."""
    try:
        response = requests.post(
            f"{BASE_URL}/assessments/{assessment_id}/submit",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={"submission": submission}
        )
        response.raise_for_status()
        data = response.json()
        print(f"Assessment submitted successfully: {data}")
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error submitting assessment: {e}")
        raise`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="curl">
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                        {`# Fetch courses
curl -X GET "https://api.ylearn.edu/courses" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"

# Fetch a specific course
curl -X GET "https://api.ylearn.edu/courses/course-1" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"

# Submit an assessment
curl -X POST "https://api.ylearn.edu/assessments/assessment-1/submit" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"submission": "This is my assessment submission."}'`}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Logs</CardTitle>
                  <CardDescription>Monitor your API usage and requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search logs..." />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Search className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 p-4 font-medium border-b">
                        <div>Timestamp</div>
                        <div>Method</div>
                        <div className="col-span-2">Endpoint</div>
                        <div>Status</div>
                      </div>

                      <div className="divide-y">
                        <div className="grid grid-cols-5 p-4 items-center">
                          <div className="text-sm">2023-05-10 14:32:15</div>
                          <div>
                            <Badge>GET</Badge>
                          </div>
                          <div className="col-span-2 text-sm">/api/courses</div>
                          <div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              200 OK
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 p-4 items-center">
                          <div className="text-sm">2023-05-10 14:30:22</div>
                          <div>
                            <Badge>GET</Badge>
                          </div>
                          <div className="col-span-2 text-sm">/api/courses/course-1</div>
                          <div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              200 OK
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 p-4 items-center">
                          <div className="text-sm">2023-05-10 14:28:05</div>
                          <div>
                            <Badge>POST</Badge>
                          </div>
                          <div className="col-span-2 text-sm">/api/assessments/assessment-1/submit</div>
                          <div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              201 Created
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 p-4 items-center">
                          <div className="text-sm">2023-05-10 14:25:18</div>
                          <div>
                            <Badge>GET</Badge>
                          </div>
                          <div className="col-span-2 text-sm">/api/users/me</div>
                          <div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              200 OK
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>API usage for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>API Calls</span>
                    <span>1,245 / 10,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "12.45%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Data Transfer</span>
                    <span>256 MB / 5 GB</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "5.12%" }} />
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  API Reference
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Developer Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  SDK Downloads
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Support Forum
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
