"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { mockArchitecture, type MicroserviceNode } from "@/lib/mock-data"
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  Info,
  FileCode,
  GraduationCap,
  ArrowLeft,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"

export default function ArchitecturePage() {
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [failedService, setFailedService] = useState<string | null>(null)

  // Update architecture data based on failure simulation
  const architecture = {
    ...mockArchitecture,
    nodes: mockArchitecture.nodes.map((node) => {
      if (simulateFailure && failedService && node.id === failedService) {
        return { ...node, status: "down" as const }
      }

      if (
        simulateFailure &&
        failedService &&
        (mockArchitecture.connections.some((conn) => conn.source === failedService && conn.target === node.id) ||
          mockArchitecture.connections.some((conn) => conn.target === failedService && conn.source === node.id))
      ) {
        return { ...node, status: "degraded" as const }
      }

      return node
    }),
  }

  const handleToggleFailure = () => {
    if (!simulateFailure) {
      // Pick a random service to fail
      const services = mockArchitecture.nodes.filter((node) => node.type === "service")
      const randomService = services[Math.floor(Math.random() * services.length)]
      setFailedService(randomService.id)
    } else {
      setFailedService(null)
    }

    setSimulateFailure(!simulateFailure)
  }

  // Count services by status
  const healthyCount = architecture.nodes.filter((node) => node.status === "healthy").length
  const degradedCount = architecture.nodes.filter((node) => node.status === "degraded").length
  const downCount = architecture.nodes.filter((node) => node.status === "down").length

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="text-lg font-semibold">
                y<span className="text-primary">Learn</span>
              </span>
            </Link>
            <Link href="/" className="flex items-center text-sm text-muted-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">System Architecture</h1>
            <p className="text-muted-foreground">Explore the microservices architecture of yLearn</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
              >
                <CheckCircle className="mr-1 h-3 w-3" /> {healthyCount} Healthy
              </Badge>

              {degradedCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500"
                >
                  <AlertCircle className="mr-1 h-3 w-3" /> {degradedCount} Degraded
                </Badge>
              )}

              {downCount > 0 && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/10 hover:text-red-500">
                  <AlertCircle className="mr-1 h-3 w-3" /> {downCount} Down
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Switch id="simulate-failure" checked={simulateFailure} onCheckedChange={handleToggleFailure} />
              <Label htmlFor="simulate-failure">Simulate Service Failure</Label>
            </div>
          </div>

          {simulateFailure && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Service Failure Detected</AlertTitle>
              <AlertDescription>
                The {architecture.nodes.find((node) => node.id === failedService)?.name} is currently experiencing
                issues. Related services may be degraded.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="c4" className="space-y-4">
            <TabsList>
              <TabsTrigger value="c4">C4 Diagram</TabsTrigger>
              <TabsTrigger value="mermaid">Mermaid Diagram</TabsTrigger>
              <TabsTrigger value="structurizr">Structurizr C4</TabsTrigger>
              <TabsTrigger value="terraform">Terraform</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="c4" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Context Diagram</CardTitle>
                  <CardDescription>C4 model showing the microservices architecture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-4 bg-muted/50">
                    <div className="mb-4">
                      <ArchitectureDiagram architecture={architecture} />
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span>Healthy</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span>Degraded</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span>Down</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mermaid" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mermaid Diagram</CardTitle>
                  <CardDescription>Flowchart representation using Mermaid syntax</CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structurizr" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Structurizr C4 Model</CardTitle>
                  <CardDescription>C4 model with AWS deployment mapping using Structurizr DSL</CardDescription>
                </CardHeader>
                <CardContent>
                  <StructurizrDiagram />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terraform" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Terraform Infrastructure</CardTitle>
                  <CardDescription>Infrastructure as Code for AWS deployment</CardDescription>
                </CardHeader>
                <CardContent>
                  <TerraformCode />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {architecture.nodes.map((node) => (
                  <ServiceCard key={node.id} service={node} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Real-time logs from all services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-xs bg-black text-green-400 p-4 rounded-md h-[400px] overflow-auto">
                    {simulateFailure ? (
                      <>
                        <p>[2023-05-10 08:15:32] [INFO] api-gateway - Received request for /courses</p>
                        <p>[2023-05-10 08:15:32] [INFO] course-service - Fetching course list</p>
                        <p>[2023-05-10 08:15:33] [INFO] course-service - Returned 5 courses</p>
                        <p>[2023-05-10 08:15:45] [INFO] api-gateway - Received request for /assessments</p>
                        <p>
                          [2023-05-10 08:15:45] [ERROR]{" "}
                          {architecture.nodes.find((node) => node.id === failedService)?.name} - Connection timeout
                        </p>
                        <p>[2023-05-10 08:15:46] [WARN] api-gateway - Service unavailable: {failedService}</p>
                        <p>[2023-05-10 08:15:46] [INFO] api-gateway - Activating circuit breaker for {failedService}</p>
                        <p>
                          [2023-05-10 08:15:47] [ERROR]{" "}
                          {architecture.nodes.find((node) => node.id === failedService)?.name} - Failed to process
                          request
                        </p>
                        <p>
                          [2023-05-10 08:15:50] [INFO] notification-service - Sending alert to system administrators
                        </p>
                        <p>[2023-05-10 08:16:01] [WARN] api-gateway - Retrying connection to {failedService}</p>
                        <p>
                          [2023-05-10 08:16:02] [ERROR]{" "}
                          {architecture.nodes.find((node) => node.id === failedService)?.name} - Service unhealthy
                        </p>
                      </>
                    ) : (
                      <>
                        <p>[2023-05-10 08:10:15] [INFO] api-gateway - System startup complete</p>
                        <p>[2023-05-10 08:10:15] [INFO] user-service - Connected to user database</p>
                        <p>[2023-05-10 08:10:15] [INFO] course-service - Connected to course database</p>
                        <p>[2023-05-10 08:10:16] [INFO] assessment-service - Connected to assessment database</p>
                        <p>[2023-05-10 08:10:16] [INFO] grading-service - Connected to grade database</p>
                        <p>[2023-05-10 08:10:17] [INFO] notification-service - Message queue connection established</p>
                        <p>[2023-05-10 08:10:30] [INFO] api-gateway - Received request for /dashboard</p>
                        <p>[2023-05-10 08:10:30] [INFO] user-service - User authenticated: s12345</p>
                        <p>[2023-05-10 08:10:31] [INFO] course-service - Fetching courses for user: s12345</p>
                        <p>[2023-05-10 08:10:31] [INFO] assessment-service - Fetching upcoming assessments</p>
                        <p>
                          [2023-05-10 08:10:32] [INFO] notification-service - Fetching notifications for user: s12345
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 yLearn. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4">
              Home
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ServiceCard({ service }: { service: MicroserviceNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{service.name}</CardTitle>
          <Badge
            variant="outline"
            className={
              service.status === "healthy"
                ? "bg-green-500/10 text-green-500"
                : service.status === "degraded"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
            }
          >
            {service.status === "healthy" && <CheckCircle className="mr-1 h-3 w-3" />}
            {service.status === "degraded" && <AlertCircle className="mr-1 h-3 w-3" />}
            {service.status === "down" && <AlertCircle className="mr-1 h-3 w-3" />}
            <span className="capitalize">{service.status}</span>
          </Badge>
        </div>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium">Type</p>
              <p className="text-muted-foreground capitalize">{service.type}</p>
            </div>
            <div>
              <p className="font-medium">ID</p>
              <p className="text-muted-foreground">{service.id}</p>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              <Info className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ArchitectureDiagram({ architecture }: { architecture: typeof mockArchitecture }) {
  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[800px] min-h-[500px] p-4">
        {/* This is a placeholder for the actual diagram */}
        {/* In a real implementation, you would use a library like ReactFlow or mermaid.js */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">C4 Diagram Visualization</p>

            {/* Mermaid diagram would be rendered here */}
            <div className="border rounded-md p-4 bg-white dark:bg-gray-900">
              <pre className="text-xs text-left overflow-auto">
                {`graph TD
  Client[Web Client] --> Gateway[API Gateway]
  Gateway --> UserService[User Service]
  Gateway --> CourseService[Course Service]
  Gateway --> AssessmentService[Assessment Service]
  Gateway --> GradingService[Grading Service]
  
  UserService --> UserDB[(User Database)]
  CourseService --> CourseDB[(Course Database)]
  AssessmentService --> AssessmentDB[(Assessment Database)]
  GradingService --> GradeDB[(Grade Database)]
  
  UserService --> Queue{Message Queue}
  CourseService --> Queue
  AssessmentService --> Queue
  GradingService --> Queue
  
  Queue --> NotificationService[Notification Service]`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MermaidDiagram() {
  const [copied, setCopied] = useState(false)

  // This is Mermaid syntax for a flowchart diagram
  const diagramCode = `graph TD
  Client[Web Client] --> Gateway[API Gateway]
  Gateway --> UserService[User Service]
  Gateway --> CourseService[Course Service]
  Gateway --> AssessmentService[Assessment Service]
  Gateway --> GradingService[Grading Service]
  
  UserService --> UserDB[(User Database)]
  CourseService --> CourseDB[(Course Database)]
  AssessmentService --> AssessmentDB[(Assessment Database)]
  GradingService --> GradeDB[(Grade Database)]
  
  UserService --> Queue{Message Queue}
  CourseService --> Queue
  AssessmentService --> Queue
  GradingService --> Queue
  
  Queue --> NotificationService[Notification Service]`

  // Create a URL for mermaid.live with our diagram code
  const mermaidLiveUrl = `https://mermaid.live/edit#${encodeURIComponent(diagramCode)}`

  const copyDiagramCode = () => {
    navigator.clipboard.writeText(diagramCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[800px] p-4">
        <div className="w-full flex items-center justify-center">
          <div className="text-center w-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">Mermaid Diagram Visualization</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={mermaidLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <span>Open in Mermaid Live</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={copyDiagramCode} className="flex items-center gap-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Mermaid diagram would be rendered here */}
            <div className="border rounded-md p-4 bg-white dark:bg-gray-900">
              <pre className="text-xs text-left overflow-auto whitespace-pre">{diagramCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StructurizrDiagram() {
  const [copied, setCopied] = useState(false)

  // Structurizr DSL for C4 model with AWS deployment mapping
  const structurizrDSL = `workspace {
  model {
      user = person "Student/Instructor" "A user of the yLearn LMS"
      
      enterprise "yLearn LMS" {
          // Software systems
          lmsSystem = softwareSystem "yLearn LMS" "Learning Management System for university settings" {
              // Containers
              webApp = container "Web Application" "Provides the user interface for the LMS" "React" "Web Application" {
                  technology "AWS CloudFront"
              }
              
              apiGateway = container "API Gateway" "Routes requests to appropriate microservices" "AWS API Gateway" {
                  technology "AWS API Gateway"
              }
              
              // Microservices
              userService = container "User Service" "Manages user authentication and profiles" "Node.js" {
                  technology "AWS ECS Fargate"
              }
              
              courseService = container "Course Service" "Manages course information and enrollments" "Node.js" {
                  technology "AWS ECS Fargate"
              }
              
              assessmentService = container "Assessment Service" "Manages assignments, quizzes, and exams" "Node.js" {
                  technology "AWS ECS Fargate"
              }
              
              gradingService = container "Grading Service" "Processes and stores grades" "Node.js" {
                  technology "AWS ECS Fargate"
              }
              
              notificationService = container "Notification Service" "Sends notifications to users" "Node.js" {
                  technology "AWS ECS Fargate"
              }
              
              // Data stores
              userDB = container "User Database" "Stores user data" "Amazon RDS" {
                  technology "AWS RDS (PostgreSQL)"
              }
              
              courseDB = container "Course Database" "Stores course data" "Amazon RDS" {
                  technology "AWS RDS (PostgreSQL)"
              }
              
              assessmentDB = container "Assessment Database" "Stores assessment data" "Amazon RDS" {
                  technology "AWS RDS (PostgreSQL)"
              }
              
              gradeDB = container "Grade Database" "Stores grade data" "Amazon RDS" {
                  technology "AWS RDS (PostgreSQL)"
              }
              
              messageQueue = container "Message Queue" "Handles asynchronous communication between services" "Amazon SQS" {
                  technology "AWS SQS"
              }
          }
          
          // Relationships
          user -> webApp "Uses"
          webApp -> apiGateway "Makes API calls to"
          
          apiGateway -> userService "Routes requests to"
          apiGateway -> courseService "Routes requests to"
          apiGateway -> assessmentService "Routes requests to"
          apiGateway -> gradingService "Routes requests to"
          
          userService -> userDB "Reads from and writes to"
          courseService -> courseDB "Reads from and writes to"
          assessmentService -> assessmentDB "Reads from and writes to"
          gradingService -> gradeDB "Reads from and writes to"
          
          userService -> messageQueue "Publishes messages to"
          courseService -> messageQueue "Publishes messages to"
          assessmentService -> messageQueue "Publishes messages to"
          gradingService -> messageQueue "Publishes messages to"
          
          messageQueue -> notificationService "Delivers messages to"
      }
  }
  
  views {
      systemContext lmsSystem "SystemContext" {
          include *
          autoLayout
      }
      
      container lmsSystem "Containers" {
          include *
          autoLayout
      }
      
      theme default
  }
}`

  // Create a URL for Structurizr with our DSL code
  const structurizrUrl = "https://structurizr.com/dsl"

  const copyDiagramCode = () => {
    navigator.clipboard.writeText(structurizrDSL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full overflow-auto">
      <div className="p-4">
        <div className="w-full flex items-center justify-center">
          <div className="text-center w-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">Structurizr C4 Model with AWS Mapping</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={structurizrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <span>Open in Structurizr</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={copyDiagramCode} className="flex items-center gap-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="border rounded-md p-4 bg-white dark:bg-gray-900">
              <pre className="text-xs text-left overflow-auto whitespace-pre">{structurizrDSL}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TerraformCode() {
  const [copied, setCopied] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string>("main")

  // Terraform code for AWS infrastructure
  const terraformFiles: Record<string, string> = {
    main: `# main.tf - Main Terraform configuration for yLearn LMS

provider "aws" {
  region = var.aws_region
}

# VPC and networking
module "vpc" {
  source = "./modules/vpc"
  
  vpc_name        = "ylearn-vpc"
  vpc_cidr        = "10.0.0.0/16"
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

# ECS Cluster for microservices
module "ecs" {
  source = "./modules/ecs"
  
  cluster_name = "ylearn-cluster"
  vpc_id       = module.vpc.vpc_id
  subnets      = module.vpc.private_subnets
}

# RDS Databases
module "databases" {
  source = "./modules/rds"
  
  vpc_id            = module.vpc.vpc_id
  subnets           = module.vpc.private_subnets
  security_group_id = module.vpc.database_security_group_id
}

# SQS Message Queue
module "sqs" {
  source = "./modules/sqs"
  
  queue_name = "ylearn-message-queue"
}

# API Gateway
module "api_gateway" {
  source = "./modules/api_gateway"
  
  name        = "ylearn-api"
  description = "API Gateway for yLearn LMS"
}

# CloudFront for web application
module "cloudfront" {
  source = "./modules/cloudfront"
  
  app_name = "ylearn"
  s3_origin_id = module.s3.bucket_id
}

# S3 for static web hosting
module "s3" {
  source = "./modules/s3"
  
  bucket_name = "ylearn-web-app"
}

# Microservices
module "user_service" {
  source = "./modules/microservice"
  
  service_name     = "user-service"
  cluster_id       = module.ecs.cluster_id
  vpc_id           = module.vpc.vpc_id
  subnets          = module.vpc.private_subnets
  container_image  = "ylearn/user-service:latest"
  container_port   = 3000
  desired_count    = 2
  
  environment_variables = {
    DB_HOST     = module.databases.user_db_endpoint
    DB_NAME     = "users"
    DB_USER     = var.db_username
    DB_PASSWORD = var.db_password
    SQS_URL     = module.sqs.queue_url
  }
}

module "course_service" {
  source = "./modules/microservice"
  
  service_name     = "course-service"
  cluster_id       = module.ecs.cluster_id
  vpc_id           = module.vpc.vpc_id
  subnets          = module.vpc.private_subnets
  container_image  = "ylearn/course-service:latest"
  container_port   = 3000
  desired_count    = 2
  
  environment_variables = {
    DB_HOST     = module.databases.course_db_endpoint
    DB_NAME     = "courses"
    DB_USER     = var.db_username
    DB_PASSWORD = var.db_password
    SQS_URL     = module.sqs.queue_url
  }
}

module "assessment_service" {
  source = "./modules/microservice"
  
  service_name     = "assessment-service"
  cluster_id       = module.ecs.cluster_id
  vpc_id           = module.vpc.vpc_id
  subnets          = module.vpc.private_subnets
  container_image  = "ylearn/assessment-service:latest"
  container_port   = 3000
  desired_count    = 2
  
  environment_variables = {
    DB_HOST     = module.databases.assessment_db_endpoint
    DB_NAME     = "assessments"
    DB_USER     = var.db_username
    DB_PASSWORD = var.db_password
    SQS_URL     = module.sqs.queue_url
  }
}

module "grading_service" {
  source = "./modules/microservice"
  
  service_name     = "grading-service"
  cluster_id       = module.ecs.cluster_id
  vpc_id           = module.vpc.vpc_id
  subnets          = module.vpc.private_subnets
  container_image  = "ylearn/grading-service:latest"
  container_port   = 3000
  desired_count    = 2
  
  environment_variables = {
    DB_HOST     = module.databases.grade_db_endpoint
    DB_NAME     = "grades"
    DB_USER     = var.db_username
    DB_PASSWORD = var.db_password
    SQS_URL     = module.sqs.queue_url
  }
}

module "notification_service" {
  source = "./modules/microservice"
  
  service_name     = "notification-service"
  cluster_id       = module.ecs.cluster_id
  vpc_id           = module.vpc.vpc_id
  subnets          = module.vpc.private_subnets
  container_image  = "ylearn/notification-service:latest"
  container_port   = 3000
  desired_count    = 2
  
  environment_variables = {
    SQS_URL = module.sqs.queue_url
  }
}`,

    variables: `# variables.tf

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}`,

    modules_microservice: `# modules/microservice/main.tf

resource "aws_ecs_task_definition" "service" {
  family                   = var.service_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = var.service_name
      image     = var.container_image
      essential = true
      
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      
      environment = [
        for key, value in var.environment_variables : {
          name  = key
          value = value
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/\${var.service_name}"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "service" {
  name            = var.service_name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.service.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnets
    security_groups = [aws_security_group.service.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }
}

resource "aws_security_group" "service" {
  name        = "\${var.service_name}-sg"
  description = "Security group for \${var.service_name} microservice"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# IAM roles for ECS tasks
resource "aws_iam_role" "ecs_execution_role" {
  name = "\${var.service_name}-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_role" {
  name = "\${var.service_name}-task-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Load balancer target group
resource "aws_lb_target_group" "service" {
  name        = "\${var.service_name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}`,
  }

  const copyTerraformCode = () => {
    const fileContent = terraformFiles[selectedFile] || ""
    navigator.clipboard.writeText(fileContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full overflow-auto">
      <div className="p-4">
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">Terraform Infrastructure as Code</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                <Button
                  variant={selectedFile === "main" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFile("main")}
                  className="rounded-r-none"
                >
                  main.tf
                </Button>
                <Button
                  variant={selectedFile === "variables" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFile("variables")}
                  className="rounded-none border-l-0"
                >
                  variables.tf
                </Button>
                <Button
                  variant={selectedFile === "modules_microservice" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFile("modules_microservice")}
                  className="rounded-l-none border-l-0"
                >
                  microservice module
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={copyTerraformCode} className="flex items-center gap-1">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="border rounded-md p-4 bg-white dark:bg-gray-900">
            <pre className="text-xs text-left overflow-auto whitespace-pre">{terraformFiles[selectedFile] || ""}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
