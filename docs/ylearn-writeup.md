# yLearn Software Architecture  
*Prepared: April 2025 | Authors: System AI Draft*

---

## 1. Design Overview

**yLearn** is a modern, modular Learning Management System (LMS) developed by the University of Queensland (UQ) to replace the aging monolithic Blackboard platform. Its purpose is to support the growing demand for online learning with a distributed, extensible, and maintainable architecture. The system is designed to allow small IT Services (ITS) teams to independently develop and manage system components without affecting the whole system.

The backend is built as a distributed system using microservices, each responsible for key LMS features such as course management, user enrolment, grading, and future extensibility like online examinations or third-party integrations (e.g. TurnItIn).

---

## 2. Discussion

### Quality Attributes Prioritized

- **Modularity**: Small teams can develop and manage features independently.
- **Extensibility**: Supports future features such as examinations, integrations, or faculty-developed tools.
- **Scalability**: System should support growing numbers of users and services across UQ.
- **Fault Tolerance**: Isolated services prevent system-wide outages.
- **Maintainability**: Microservice boundaries reduce complexity and facilitate independent updates.
- **Security**: SAML-based UQ Single Sign-On (SSO), role-based access control, and user data protection.

### Key Use Cases

- Enrolling in courses
- Viewing and submitting assessments
- Grading by instructors
- Notifications and feedback
- Adding integrations (e.g. TurnItIn's similarity/originality tools)

### Trade-Offs

- Increased complexity in infrastructure and service orchestration
- Higher operational overhead (e.g., monitoring, service discovery)
- Need for strong API and data contract governance

---

## 3. Sketching

### 3.1 Overview

- **API Gateway** acts as a single entry point.
- Each feature domain (courses, users, grading) is a separate microservice.
- Data storage is split per domain (bounded contexts).
- Authentication and Authorization are externalized to a dedicated Identity Provider (UQ SSO).
- Internal services communicate over secure gRPC/REST.
- Asynchronous messaging (e.g., AWS SNS/SQS) is used for decoupling notifications and event publishing.

### 3.2 Initial Distributed Feature Set

- **User Service** – SSO, profile, roles
- **Course Service** – Course CRUD and catalog
- **Enrollment Service** – Tracks students per course
- **Assessment Service** – Assignment and submission tracking
- **Grading Service** – Grade records, feedback
- **Notification Service** – Emails, alerts, announcements
- **Gateway API** – Unifies routing

### 3.3 Component Interfaces

- Each service exposes RESTful or gRPC APIs.
- Internal services use shared schemas via protobuf or OpenAPI.
- Authentication is handled via signed SAML assertions passed to the gateway and propagated downstream using JWT.

### 3.4 Scaling

- Services deployed on Kubernetes (or ECS Fargate).
- Stateless services scale horizontally.
- Database sharding for course and student datasets.
- CDN used for static content like course materials or videos.

---

## 4. Optimisation

### TurnItIn Integration

- Implement via **Assessment Service plugin interface**
- Define integration points for submission, plagiarism check, and feedback loop
- Use secure webhook callbacks from TurnItIn into yLearn's grading pipeline

### Self-managed Tools by Academics

- Provide containerized app deployment per course namespace (e.g., via AWS AppRunner or Lambda)
- Use scoped tokens for course data access
- Academics granted scoped access to REST APIs via service console

---

## 5. Design Challenges

### 5.1 User Authentication

- Integrate with UQ's SAML-based SSO system
- Maintain session tokens (e.g. via JWT) after SAML login
- For non-UQ accounts, fallback to OAuth2 identity provider (optional)

### 5.2 Fault Tolerance

- Circuit breakers and retries via service mesh (e.g., Istio)
- Queue-based recovery and dead letter queues for asynchronous failures
- Health probes and autoscaling policies for recovery

### 5.3 Ad-hoc Tooling by Academics

- Use internal developer portal for launching sandboxed tools
- Define API scopes and auditing for tool actions
- Avoid ITS involvement via declarative course-based permissions
