"use client"

import { MermaidDiagram } from "./mermaid-diagram"

export function AWSArchitecture() {
  const awsDiagram = `flowchart TB
    subgraph "AWS Cloud"
      subgraph "VPC"
        subgraph "Public Subnet"
          ALB["Application Load Balancer"]
          WAF["AWS WAF"]
        end
        
        subgraph "Private Subnet - Services"
          ECS["ECS Fargate Cluster"]
          subgraph "Microservices"
            UserService["User Service"]
            CourseService["Course Service"]
            AssessmentService["Assessment Service"]
            GradingService["Grading Service"]
            NotificationService["Notification Service"]
          end
        end
        
        subgraph "Private Subnet - Data"
          RDS["Amazon RDS"]
          subgraph "Databases"
            UserDB[(User DB)]
            CourseDB[(Course DB)]
            AssessmentDB[(Assessment DB)]
            GradeDB[(Grade DB)]
          end
          ElastiCache["ElastiCache Redis"]
        end
      end
      
      S3["S3 Buckets"]
      CloudFront["CloudFront"]
      Route53["Route 53"]
      SQS["SQS Message Queue"]
      SNS["SNS Notifications"]
      Cognito["Cognito User Pools"]
      CloudWatch["CloudWatch"]
      
      APIGateway["API Gateway"]
    end
    
    Users["Users"] --> Route53
    Route53 --> CloudFront
    CloudFront --> S3
    CloudFront --> ALB
    WAF --> ALB
    ALB --> APIGateway
    APIGateway --> UserService
    APIGateway --> CourseService
    APIGateway --> AssessmentService
    APIGateway --> GradingService
    
    UserService --> UserDB
    CourseService --> CourseDB
    AssessmentService --> AssessmentDB
    GradingService --> GradeDB
    
    UserService --> SQS
    CourseService --> SQS
    AssessmentService --> SQS
    GradingService --> SQS
    
    SQS --> NotificationService
    NotificationService --> SNS
    
    UserService --> ElastiCache
    CourseService --> ElastiCache
    AssessmentService --> ElastiCache
    GradingService --> ElastiCache
    
    UserService --> Cognito
    
    UserService --> CloudWatch
    CourseService --> CloudWatch
    AssessmentService --> CloudWatch
    GradingService --> CloudWatch
    NotificationService --> CloudWatch
    
    classDef aws fill:#FF9900,stroke:#232F3E,color:white;
    classDef database fill:#3C873A,stroke:#232F3E,color:white;
    classDef service fill:#1E88E5,stroke:#232F3E,color:white;
    
    class S3,CloudFront,Route53,SQS,SNS,Cognito,CloudWatch,APIGateway,ALB,WAF,ECS,ElastiCache,RDS aws;
    class UserDB,CourseDB,AssessmentDB,GradeDB database;
    class UserService,CourseService,AssessmentService,GradingService,NotificationService service;`

  return <MermaidDiagram definition={awsDiagram} caption="AWS Architecture Diagram for yLearn LMS" type="flowchart" />
}
