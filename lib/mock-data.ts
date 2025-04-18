import type { UserRole } from "./auth-context"

// Course types
export interface Course {
  id: string
  code: string
  name: string
  description: string
  instructor: string
  term: string
  credits: number
  image: string
}

// Assessment types
export interface Assessment {
  id: string
  courseId: string
  title: string
  description: string
  dueDate: string
  type: "assignment" | "quiz" | "exam" | "project"
  status: "upcoming" | "open" | "submitted" | "graded" | "late"
  weight: number
  maxScore: number
  score?: number
  feedback?: string
  submissionDate?: string
  plagiarismScore?: number
}

// Grade types
export interface Grade {
  id: string
  courseId: string
  assessmentId: string
  studentId: string
  score: number
  maxScore: number
  feedback?: string
  submissionDate: string
  gradedDate?: string
  gradedBy?: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  date: string
  read: boolean
  type: "announcement" | "grade" | "assignment" | "system"
  link?: string
}

// Mock courses
export const mockCourses: Course[] = [
  {
    id: "course-1",
    code: "CSSE6400",
    name: "Software Architecture",
    description: "Learn about software architecture patterns and practices for building scalable systems.",
    instructor: "Dr. Jamie Professor",
    term: "Semester 1, 2023",
    credits: 4,
    image: "/interconnected-systems.png",
  },
  {
    id: "course-2",
    code: "CSSE6401",
    name: "Advanced Programming",
    description: "Explore advanced programming concepts and paradigms.",
    instructor: "Prof. Taylor Smith",
    term: "Semester 1, 2023",
    credits: 4,
    image: "/abstract-code-flow.png",
  },
  {
    id: "course-3",
    code: "CSSE6402",
    name: "Database Systems",
    description: "Study database design, implementation, and optimization techniques.",
    instructor: "Dr. Morgan Lee",
    term: "Semester 1, 2023",
    credits: 4,
    image: "/placeholder.svg?height=200&width=400&query=Database Systems",
  },
  {
    id: "course-4",
    code: "CSSE6403",
    name: "Web Development",
    description: "Learn modern web development frameworks and practices.",
    instructor: "Dr. Jamie Professor",
    term: "Semester 1, 2023",
    credits: 4,
    image: "/placeholder.svg?height=200&width=400&query=Web Development",
  },
  {
    id: "course-5",
    code: "CSSE6404",
    name: "Machine Learning",
    description: "Introduction to machine learning algorithms and applications.",
    instructor: "Prof. Jordan Rivera",
    term: "Semester 1, 2023",
    credits: 4,
    image: "/placeholder.svg?height=200&width=400&query=Machine Learning",
  },
]

// Mock assessments
export const mockAssessments: Assessment[] = [
  {
    id: "assessment-1",
    courseId: "course-1",
    title: "Architecture Design Document",
    description: "Create a comprehensive architecture design document for a distributed system.",
    dueDate: "2023-04-15T23:59:59",
    type: "assignment",
    status: "graded",
    weight: 30,
    maxScore: 100,
    score: 85,
    feedback: "Good work on the component diagrams. Consider adding more details on scalability.",
    submissionDate: "2023-04-14T14:30:00",
  },
  {
    id: "assessment-2",
    courseId: "course-1",
    title: "Microservices Quiz",
    description: "Online quiz covering microservices architecture concepts.",
    dueDate: "2023-03-10T23:59:59",
    type: "quiz",
    status: "graded",
    weight: 15,
    maxScore: 50,
    score: 42,
    submissionDate: "2023-03-10T22:45:00",
  },
  {
    id: "assessment-3",
    courseId: "course-1",
    title: "Final Project",
    description: "Implement a scalable microservices-based application.",
    dueDate: "2023-05-20T23:59:59",
    type: "project",
    status: "open",
    weight: 40,
    maxScore: 100,
  },
  {
    id: "assessment-4",
    courseId: "course-2",
    title: "Algorithm Implementation",
    description: "Implement and analyze the performance of sorting algorithms.",
    dueDate: "2023-04-05T23:59:59",
    type: "assignment",
    status: "graded",
    weight: 25,
    maxScore: 100,
    score: 92,
    feedback: "Excellent implementation and analysis.",
    submissionDate: "2023-04-04T18:20:00",
  },
  {
    id: "assessment-5",
    courseId: "course-3",
    title: "Database Design Project",
    description: "Design and implement a normalized database for a given scenario.",
    dueDate: "2023-04-25T23:59:59",
    type: "project",
    status: "submitted",
    weight: 35,
    maxScore: 100,
    submissionDate: "2023-04-24T20:15:00",
    plagiarismScore: 5,
  },
]

// Mock grades
export const mockGrades: Grade[] = [
  {
    id: "grade-1",
    courseId: "course-1",
    assessmentId: "assessment-1",
    studentId: "s12345",
    score: 85,
    maxScore: 100,
    feedback: "Good work on the component diagrams. Consider adding more details on scalability.",
    submissionDate: "2023-04-14T14:30:00",
    gradedDate: "2023-04-18T10:15:00",
    gradedBy: "i67890",
  },
  {
    id: "grade-2",
    courseId: "course-1",
    assessmentId: "assessment-2",
    studentId: "s12345",
    score: 42,
    maxScore: 50,
    submissionDate: "2023-03-10T22:45:00",
    gradedDate: "2023-03-11T09:30:00",
    gradedBy: "i67890",
  },
  {
    id: "grade-3",
    courseId: "course-2",
    assessmentId: "assessment-4",
    studentId: "s12345",
    score: 92,
    maxScore: 100,
    feedback: "Excellent implementation and analysis.",
    submissionDate: "2023-04-04T18:20:00",
    gradedDate: "2023-04-08T11:45:00",
    gradedBy: "i67890",
  },
]

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "s12345",
    title: "New Assignment Posted",
    message: "A new assignment 'Final Project' has been posted in Software Architecture.",
    date: "2023-04-01T09:30:00",
    read: false,
    type: "assignment",
    link: "/courses/course-1/assessments/assessment-3",
  },
  {
    id: "notif-2",
    userId: "s12345",
    title: "Grade Posted",
    message: "Your grade for 'Architecture Design Document' has been posted.",
    date: "2023-04-18T10:20:00",
    read: true,
    type: "grade",
    link: "/grades/course-1/assessment-1",
  },
  {
    id: "notif-3",
    userId: "s12345",
    title: "System Maintenance",
    message: "yLearn will be undergoing maintenance on Sunday, April 30th from 2-4 AM.",
    date: "2023-04-25T12:00:00",
    read: false,
    type: "system",
  },
  {
    id: "notif-4",
    userId: "i67890",
    title: "Grading Reminder",
    message: "You have 5 submissions waiting to be graded for 'Database Design Project'.",
    date: "2023-04-26T08:15:00",
    read: false,
    type: "assignment",
    link: "/courses/course-3/assessments/assessment-5/grade",
  },
  {
    id: "notif-5",
    userId: "i67890",
    title: "Course Evaluation",
    message: "Course evaluations are now open for your courses.",
    date: "2023-05-01T09:00:00",
    read: true,
    type: "announcement",
  },
]

// Helper function to get role-specific data
export function getNotificationsForUser(userId: string): Notification[] {
  return mockNotifications.filter((notification) => notification.userId === userId)
}

export function getCoursesForUser(role: UserRole, userId: string): Course[] {
  // In a real app, we would filter based on enrollments or teaching assignments
  // For this demo, we'll return all courses
  return mockCourses
}

export function getAssessmentsForCourse(courseId: string): Assessment[] {
  return mockAssessments.filter((assessment) => assessment.courseId === courseId)
}

export function getGradesForStudent(studentId: string): Grade[] {
  return mockGrades.filter((grade) => grade.studentId === studentId)
}

export function getGradesForCourse(courseId: string): Grade[] {
  return mockGrades.filter((grade) => grade.courseId === courseId)
}

// Microservices architecture data for the Architecture view
export interface MicroserviceNode {
  id: string
  name: string
  description: string
  status: "healthy" | "degraded" | "down"
  type: "service" | "database" | "queue" | "gateway" | "client"
}

export interface MicroserviceConnection {
  source: string
  target: string
  label?: string
}

export const mockArchitecture: {
  nodes: MicroserviceNode[]
  connections: MicroserviceConnection[]
} = {
  nodes: [
    {
      id: "client",
      name: "Web Client",
      description: "React frontend application",
      status: "healthy",
      type: "client",
    },
    {
      id: "api-gateway",
      name: "API Gateway",
      description: "Routes requests to appropriate microservices",
      status: "healthy",
      type: "gateway",
    },
    {
      id: "user-service",
      name: "User Service",
      description: "Manages user authentication and profiles",
      status: "healthy",
      type: "service",
    },
    {
      id: "course-service",
      name: "Course Service",
      description: "Manages course information and enrollments",
      status: "healthy",
      type: "service",
    },
    {
      id: "assessment-service",
      name: "Assessment Service",
      description: "Manages assignments, quizzes, and exams",
      status: "healthy",
      type: "service",
    },
    {
      id: "grading-service",
      name: "Grading Service",
      description: "Processes and stores grades",
      status: "healthy",
      type: "service",
    },
    {
      id: "notification-service",
      name: "Notification Service",
      description: "Sends notifications to users",
      status: "healthy",
      type: "service",
    },
    {
      id: "user-db",
      name: "User Database",
      description: "Stores user data",
      status: "healthy",
      type: "database",
    },
    {
      id: "course-db",
      name: "Course Database",
      description: "Stores course data",
      status: "healthy",
      type: "database",
    },
    {
      id: "assessment-db",
      name: "Assessment Database",
      description: "Stores assessment data",
      status: "healthy",
      type: "database",
    },
    {
      id: "grade-db",
      name: "Grade Database",
      description: "Stores grade data",
      status: "healthy",
      type: "database",
    },
    {
      id: "message-queue",
      name: "Message Queue",
      description: "Handles asynchronous communication between services",
      status: "healthy",
      type: "queue",
    },
  ],
  connections: [
    { source: "client", target: "api-gateway" },
    { source: "api-gateway", target: "user-service" },
    { source: "api-gateway", target: "course-service" },
    { source: "api-gateway", target: "assessment-service" },
    { source: "api-gateway", target: "grading-service" },
    { source: "user-service", target: "user-db" },
    { source: "course-service", target: "course-db" },
    { source: "assessment-service", target: "assessment-db" },
    { source: "grading-service", target: "grade-db" },
    { source: "user-service", target: "message-queue" },
    { source: "course-service", target: "message-queue" },
    { source: "assessment-service", target: "message-queue" },
    { source: "grading-service", target: "message-queue" },
    { source: "message-queue", target: "notification-service" },
  ],
}
