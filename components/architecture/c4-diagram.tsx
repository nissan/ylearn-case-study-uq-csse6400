"use client"

import { MermaidDiagram } from "./mermaid-diagram"

interface C4DiagramProps {
  level: "context" | "container" | "component" | "code"
  title: string
}

export function C4Diagram({ level, title }: C4DiagramProps) {
  // Different diagram definitions based on the C4 level
  const diagrams = {
    context: `C4Context
    title ${title} - System Context Diagram
    
    Person(student, "Student", "A user of the yLearn LMS")
    Person(instructor, "Instructor", "Creates and manages courses")
    Person(admin, "Administrator", "Manages the system")
    
    System(yLearn, "yLearn LMS", "Learning Management System for university settings")
    
    System_Ext(email, "Email System", "Sends notifications to users")
    System_Ext(turnItIn, "TurnItIn", "Plagiarism detection service")
    
    Rel(student, yLearn, "Uses")
    Rel(instructor, yLearn, "Manages courses")
    Rel(admin, yLearn, "Administers")
    Rel(yLearn, email, "Sends emails via")
    Rel(yLearn, turnItIn, "Checks submissions with")`,

    container: `C4Container
    title ${title} - Container Diagram
    
    Person(student, "Student", "A user of the yLearn LMS")
    Person(instructor, "Instructor", "Creates and manages courses")
    
    System_Boundary(yLearn, "yLearn LMS") {
      Container(webApp, "Web Application", "React", "Provides the user interface for the LMS")
      Container(apiGateway, "API Gateway", "AWS API Gateway", "Routes requests to appropriate microservices")
      
      Container(userService, "User Service", "Node.js", "Manages user authentication and profiles")
      Container(courseService, "Course Service", "Node.js", "Manages course information and enrollments")
      Container(assessmentService, "Assessment Service", "Node.js", "Manages assignments, quizzes, and exams")
      Container(gradingService, "Grading Service", "Node.js", "Processes and stores grades")
      Container(notificationService, "Notification Service", "Node.js", "Sends notifications to users")
      
      ContainerDb(userDb, "User Database", "PostgreSQL", "Stores user data")
      ContainerDb(courseDb, "Course Database", "PostgreSQL", "Stores course data")
      ContainerDb(assessmentDb, "Assessment Database", "PostgreSQL", "Stores assessment data")
      ContainerDb(gradeDb, "Grade Database", "PostgreSQL", "Stores grade data")
      
      Container(messageQueue, "Message Queue", "AWS SQS", "Handles asynchronous communication between services")
    }
    
    System_Ext(email, "Email System", "Sends notifications to users")
    System_Ext(turnItIn, "TurnItIn", "Plagiarism detection service")
    
    Rel(student, webApp, "Uses")
    Rel(instructor, webApp, "Uses")
    Rel(webApp, apiGateway, "Makes API calls to")
    
    Rel(apiGateway, userService, "Routes requests to")
    Rel(apiGateway, courseService, "Routes requests to")
    Rel(apiGateway, assessmentService, "Routes requests to")
    Rel(apiGateway, gradingService, "Routes requests to")
    
    Rel(userService, userDb, "Reads from and writes to")
    Rel(courseService, courseDb, "Reads from and writes to")
    Rel(assessmentService, assessmentDb, "Reads from and writes to")
    Rel(gradingService, gradeDb, "Reads from and writes to")
    
    Rel(userService, messageQueue, "Publishes messages to")
    Rel(courseService, messageQueue, "Publishes messages to")
    Rel(assessmentService, messageQueue, "Publishes messages to")
    Rel(gradingService, messageQueue, "Publishes messages to")
    
    Rel(messageQueue, notificationService, "Delivers messages to")
    Rel(notificationService, email, "Sends emails via")
    Rel(assessmentService, turnItIn, "Checks submissions with")`,

    component: `C4Component
    title ${title} - Component Diagram (Assessment Service)
    
    Container_Boundary(assessmentService, "Assessment Service") {
      Component(assessmentApi, "Assessment API", "Express.js", "Handles HTTP requests for assessments")
      Component(assessmentManager, "Assessment Manager", "TypeScript", "Business logic for assessment operations")
      Component(submissionProcessor, "Submission Processor", "TypeScript", "Processes student submissions")
      Component(plagiarismChecker, "Plagiarism Checker", "TypeScript", "Integrates with TurnItIn")
      Component(notificationPublisher, "Notification Publisher", "TypeScript", "Publishes events to message queue")
      Component(dataAccess, "Data Access Layer", "TypeScript + Prisma", "Handles database operations")
    }
    
    ContainerDb(assessmentDb, "Assessment Database", "PostgreSQL", "Stores assessment data")
    Container(messageQueue, "Message Queue", "AWS SQS", "Handles asynchronous communication")
    System_Ext(turnItIn, "TurnItIn", "Plagiarism detection service")
    
    Rel(assessmentApi, assessmentManager, "Uses")
    Rel(assessmentManager, submissionProcessor, "Uses")
    Rel(assessmentManager, dataAccess, "Uses")
    Rel(submissionProcessor, plagiarismChecker, "Uses")
    Rel(submissionProcessor, notificationPublisher, "Uses")
    Rel(plagiarismChecker, turnItIn, "Calls API of")
    Rel(dataAccess, assessmentDb, "Reads from and writes to")
    Rel(notificationPublisher, messageQueue, "Publishes to")`,

    code: `C4Code
    title ${title} - Code Diagram (Submission Processor)
    
    CodeElement(submissionProcessor, "Submission Processor")
    CodeElement(fileValidator, "File Validator")
    CodeElement(contentExtractor, "Content Extractor")
    CodeElement(metadataParser, "Metadata Parser")
    CodeElement(plagiarismClient, "Plagiarism Client")
    CodeElement(storageManager, "Storage Manager")
    CodeElement(eventEmitter, "Event Emitter")
    
    Rel(submissionProcessor, fileValidator, "Validates submission files using")
    Rel(submissionProcessor, contentExtractor, "Extracts content using")
    Rel(submissionProcessor, metadataParser, "Parses metadata using")
    Rel(submissionProcessor, plagiarismClient, "Checks plagiarism using")
    Rel(submissionProcessor, storageManager, "Stores files using")
    Rel(submissionProcessor, eventEmitter, "Emits events using")`,
  }

  return (
    <MermaidDiagram
      definition={diagrams[level]}
      caption={`${title} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`}
      type="c4"
    />
  )
}
