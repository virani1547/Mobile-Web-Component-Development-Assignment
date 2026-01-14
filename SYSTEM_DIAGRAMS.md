# EduLearn System Diagrams

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EDULEARN LMS SYSTEM                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                               │
│                   (Static HTML + JavaScript)                          │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Login.html  │  │Courses.html  │  │Grades.html   │  │Dashboard │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │Register.html │  │Assignments   │  │Submissions   │  │Profile   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌──────────────────────────────────────────────────────────────────────┐
│                      BACKEND API LAYER (Flask)                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Routes Layer              Services Layer        Models Layer         │
│  ┌──────────────────┐      ┌──────────────┐     ┌──────────────┐    │
│  │ /api/auth        │─────→│ AuthService  │     │ Student      │    │
│  │ /api/courses     │      └──────────────┘     └──────────────┘    │
│  │ /api/assignments │      ┌──────────────┐     ┌──────────────┐    │
│  │ /api/submissions │─────→│ CourseService│     │ Course       │    │
│  │ /api/grades      │      └──────────────┘     └──────────────┘    │
│  │ /api/students    │      ┌──────────────┐     ┌──────────────┐    │
│  └──────────────────┘      │ Grade Service│─────│ Assignment   │    │
│                            └──────────────┘     └──────────────┘    │
│                            ┌──────────────┐     ┌──────────────┐    │
│                            │Student Service│────│ Submission   │    │
│                            └──────────────┘     └──────────────┘    │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
                              ↓ SQL
┌──────────────────────────────────────────────────────────────────────┐
│                     DATA PERSISTENCE LAYER                            │
├──────────────────────────────────────────────────────────────────────┤
│                  SQLite Database (edulearn.db)                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│  │ students     │ │ courses      │ │ assignments  │ │ grades     │ │
│  │ instructors  │ │ enrollments  │ │ submissions  │ │ audit_logs │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                    DATABASE ENTITY RELATIONSHIPS                     │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│     STUDENT         │         │    INSTRUCTOR       │
├─────────────────────┤         ├─────────────────────┤
│ id (PK)             │         │ id (PK)             │
│ name                │         │ name                │
│ email (UNIQUE)      │         │ email (UNIQUE)      │
│ password            │         │ password            │
│ role                │         │ role                │
│ created_at          │         │ created_at          │
│ updated_at          │         │ updated_at          │
└─────────────────────┘         └─────────────────────┘
         │ 1                              │ 1
         │                               │
         │ *                             │ *
         └──────────────────┬──────────────┘
                            │
                    ┌───────▼────────┐
                    │    COURSE      │
                    ├────────────────┤
                    │ id (PK)        │
                    │ title          │
                    │ description    │
                    │ instructor_id  │◄──────┐
                    │ capacity       │       │ FK
                    │ created_at     │       │
                    │ updated_at     │       │
                    └────────────────┘       │
                            │ 1              │
                            │                │
                            │ *              │
                    ┌───────▼────────┐       │
                    │  ENROLLMENT    │       │
                    ├────────────────┤       │
                    │ id (PK)        │       │
                    │ student_id (FK)├──────►STUDENT
                    │ course_id (FK) ├──────►COURSE
                    │ status         │
                    │ created_at     │
                    └────────────────┘


┌────────────────────┐        ┌────────────────────┐
│   ASSIGNMENT       │        │   SUBMISSION       │
├────────────────────┤        ├────────────────────┤
│ id (PK)            │        │ id (PK)            │
│ course_id (FK)     │◄───────│ assignment_id (FK) │
│ title              │        │ student_id (FK)    │
│ description        │        │ file_content       │
│ due_date           │        │ file_name          │
│ created_at         │        │ status             │
│ updated_at         │        │ submitted_at       │
└────────────────────┘        └────────────────────┘
         │ 1                           │ 1
         │                            │
         │ *                          │ *
         └────────────┬───────────────┘
                      │
               ┌──────▼──────┐
               │   GRADE     │
               ├─────────────┤
               │ id (PK)     │
               │ student_id  │
               │ assignment_id
               │ score       │
               │ feedback    │
               │ graded_at   │
               └─────────────┘


┌──────────────────────┐
│    AUDIT_LOG         │
├──────────────────────┤
│ id (PK)              │
│ action               │
│ entity_type          │
│ entity_id            │
│ changes              │
│ user_id              │
│ created_at           │
└──────────────────────┘
```

---

## 3. Authentication & User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              AUTHENTICATION & USER FLOW                          │
└─────────────────────────────────────────────────────────────────┘

START (User arrives at EduLearn)
│
├─→ [Landing Page] ──────→ index.html (Features Overview)
│                              │
│                              ├─→ "Sign In" Link ──→ [LOGIN PAGE]
│                              │
│                              └─→ "Get Started" ──→ [REGISTER PAGE]
│
├─→ [LOGIN FLOW]
│   │
│   └─→ login.html
│       ├─→ Enter: email + password
│       ├─→ POST /api/auth/login
│       │   ├─→ Authenticate student ✓
│       │   │   └─→ Return: token + user data
│       │   │       ├─→ Store in localStorage
│       │   │       └─→ Redirect to /dashboard
│       │   │
│       │   └─→ Authenticate instructor ✓
│       │       └─→ Return: token + user data
│       │           ├─→ Store in localStorage
│       │           └─→ Redirect to /dashboard
│       │
│       └─→ Invalid Credentials ✗
│           └─→ Show Error Message
│
├─→ [REGISTRATION FLOW]
│   │
│   └─→ register.html
│       ├─→ Enter: name + email + password + role
│       ├─→ POST /api/auth/register
│       │   ├─→ Register as Student ✓
│       │   │   └─→ Create student record
│       │   │       └─→ Return token
│       │   │
│       │   └─→ Register as Instructor ✓
│       │       └─→ Create instructor record
│       │           └─→ Return token
│       │
│       └─→ Redirect to Dashboard
│
├─→ [AUTHENTICATED USER - DASHBOARD]
│   │
│   ├─→ [STUDENT DASHBOARD]
│   │   ├─→ View My Courses
│   │   ├─→ View My Assignments
│   │   ├─→ View My Grades
│   │   ├─→ Submit Assignments
│   │   └─→ View Profile
│   │
│   └─→ [INSTRUCTOR DASHBOARD]
│       ├─→ Manage Courses
│       ├─→ Create Assignments
│       ├─→ Grade Submissions
│       ├─→ View Student Progress
│       └─→ View Analytics
│
└─→ LOGOUT
    └─→ Clear token from localStorage
        └─→ Redirect to Login
```

---

## 4. API Endpoints Map

```
┌──────────────────────────────────────────────────────────────┐
│               REST API ENDPOINTS                             │
└──────────────────────────────────────────────────────────────┘

AUTHENTICATION
├─ POST   /api/auth/login               → Login user
├─ POST   /api/auth/register            → Register new user
├─ POST   /api/auth/register/instructor → Register instructor
└─ POST   /api/auth/login/student       → Login as student


COURSES
├─ GET    /api/courses                  → Get all courses
├─ GET    /api/courses/<id>             → Get course details
├─ POST   /api/courses                  → Create course
├─ POST   /api/courses/<id>/enroll      → Enroll student
└─ PUT    /api/courses/<id>             → Update course


ASSIGNMENTS
├─ GET    /api/assignments/<id>         → Get assignment details
├─ GET    /api/assignments/course/<id>  → Get course assignments
├─ POST   /api/assignments              → Create assignment
└─ PUT    /api/assignments/<id>         → Update assignment


SUBMISSIONS
├─ GET    /api/submissions/<id>         → Get submission
├─ GET    /api/submissions/student/<id> → Get student submissions
├─ POST   /api/submissions              → Submit assignment
└─ PUT    /api/submissions/<id>         → Update submission


GRADES
├─ GET    /api/grades/<id>              → Get grade
├─ GET    /api/grades/student/<id>      → Get student grades
├─ POST   /api/grades                   → Create/Post grade
└─ PUT    /api/grades/<id>              → Update grade


STUDENTS
├─ GET    /api/students                 → Get all students
├─ GET    /api/students/<id>            → Get student details
├─ GET    /api/students/<id>/grades     → Get student grades
└─ POST   /api/students                 → Register student


UTILITIES
├─ GET    /api/health                   → Health check
└─ GET    /api/routes                   → List all routes
```

---

## 5. Data Flow Diagram - Course Enrollment

```
┌──────────────────────────────────────────────────────────────┐
│     STUDENT ENROLLS IN COURSE - DATA FLOW                     │
└──────────────────────────────────────────────────────────────┘

   FRONTEND (Browser)              BACKEND (Flask)         DATABASE
        │                                │                      │
        │─ Click "Enroll" ─────────────→ │                      │
        │  Button in                      │                      │
        │  courses.html                   │                      │
        │                                 │                      │
        │                          POST /api/courses/           │
        │                          <course_id>/enroll           │
        │                                 │                      │
        │                          CourseService.               │
        │                          enroll_student()             │
        │                                 │                      │
        │                          Create Enrollment            │
        │                          object                       │
        │                                 │                      │
        │                                 │─ INSERT ───────────→ INSERT INTO
        │                                 │  ENROLLMENT          enrollments
        │                                 │  (student_id,        (student_id,
        │                                 │   course_id,         course_id,
        │                                 │   status)            status)
        │                                 │                      │
        │                                 │←─ Enrollment ←──────│ ID
        │                                 │   created
        │                                 │   successfully
        │                                 │
        │←─────── Response ───────────────│
        │  {id, status}                   │
        │
        │─ Show ─────────────────────────→
        │  Success Message                │
        │  "Enrolled!"                    │
        │
        └────────────────────────────────┘
```

---

## 6. Feature Access Control Flow

```
┌──────────────────────────────────────────────────────────────┐
│           FEATURE ACCESS & ROLE-BASED VISIBILITY              │
└──────────────────────────────────────────────────────────────┘

                    LOGIN
                      │
           ┌──────────┴──────────┐
           │                     │
        STUDENT              INSTRUCTOR
           │                     │
    ┌──────┴──────┐       ┌──────┴──────┐
    │             │       │             │
  DASHBOARD    COURSES  DASHBOARD    COURSES
    │             │       │             │
    ├─ View My   ├─ View ├─ Create   ├─ Create
    │  Courses   │       │  Courses  │
    │            │       │           │
    ├─ View      ├─ Enroll ├─ View  ├─ Manage
    │  Grades    │  in     │  All    │
    │            │  Courses│ Students│
    ├─ Assignments ├─ Submit ├─ Grade ├─ Set
    │            │       │  Work   │ Deadlines
    │            │       │         │
    ├─ Submit    ├─ View ├─ View   ├─ Analytics
    │  Work      │ My    │ Progress│
    │            │ Grade │         │
    └────────────┴───────┴─────────┴───────
                         │
                    PROFILE
                    SETTINGS
                    LOGOUT
```

---

## 7. Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                         │
├─────────────────────────────────────────────────────────────┤

┌─ FRONTEND ─────────────────────────────────────────────────┐
│                                                             │
│  HTML5 + CSS3 + Tailwind CSS      JavaScript (Vanilla)     │
│  ├─ Semantic HTML                 ├─ DOM Manipulation      │
│  ├─ Responsive Design             ├─ Fetch API            │
│  ├─ Accessible Components         ├─ localStorage (JWT)    │
│  └─ Mobile-First Approach         └─ Event Handling        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─ BACKEND ──────────────────────────────────────────────────┐
│                                                             │
│  Python 3.x + Flask Framework                             │
│  ├─ Flask-SQLAlchemy (ORM)                               │
│  ├─ Flask-CORS (API Cross-Origin)                        │
│  ├─ RESTful API Design                                    │
│  └─ Service Layer Architecture                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─ DATABASE ─────────────────────────────────────────────────┐
│                                                             │
│  SQLite (SQL Database)                                    │
│  ├─ Relational Schema                                     │
│  ├─ Foreign Key Constraints                               │
│  ├─ Audit Logging                                         │
│  └─ Instance Folder: /backend/instance/edulearn.db        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─ DEPLOYMENT ───────────────────────────────────────────────┐
│                                                             │
│  Local Development:                                        │
│  ├─ Flask Development Server (0.0.0.0:5000)              │
│  ├─ Static Files from /frontend                           │
│  └─ Hot Reload Enabled (Debug Mode)                       │
│                                                             │
│  Production Ready:                                         │
│  └─ Can be deployed with Gunicorn/WSGI server            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Request/Response Cycle Example

```
┌──────────────────────────────────────────────────────────────┐
│        EXAMPLE: GET STUDENT'S COURSES - REQUEST FLOW          │
└──────────────────────────────────────────────────────────────┘

1. CLIENT REQUEST
   ├─ Method: GET
   ├─ URL: http://localhost:5000/api/courses
   ├─ Headers:
   │  └─ Authorization: Bearer token_f7bd7915...
   │
   └─ Browser fetch() call in dashboard.html

2. FLASK ROUTER
   ├─ Route Match: /api/courses
   ├─ Blueprint: course_bp
   ├─ Handler: get_courses()
   │
   └─ Load Service Layer

3. SERVICE LAYER
   ├─ CourseService.get_all_courses()
   ├─ Query Database:
   │  └─ SELECT * FROM courses
   │
   └─ Return List[Course] objects

4. DATABASE QUERY
   ├─ Execute: SELECT * FROM courses
   ├─ Return Rows:
   │  ├─ Course 1: Python Programming 101
   │  ├─ Course 2: Web Development with Flask
   │  └─ ...
   │
   └─ Return to Service

5. RESPONSE FORMATTING
   ├─ Convert objects to JSON
   ├─ Format:
   │  {
   │    "id": "uuid",
   │    "title": "...",
   │    "description": "...",
   │    "instructor_id": "...",
   │    "capacity": 30
   │  }
   │
   └─ Set Content-Type: application/json

6. HTTP RESPONSE
   ├─ Status: 200 OK
   ├─ Headers:
   │  ├─ Content-Type: application/json
   │  └─ CORS Headers
   │
   └─ Body: JSON Array of Courses

7. BROWSER PROCESSING
   ├─ Receive Response
   ├─ Parse JSON
   ├─ Update DOM
   │  └─ Render courses in courses.html
   │
   └─ Display to User
```

---

## Summary Statistics

```
┌──────────────────────────────────────┐
│        SYSTEM STATISTICS             │
├──────────────────────────────────────┤
│ Backend Routes:        6 Blueprints  │
│ API Endpoints:         25+           │
│ Database Tables:       9             │
│ Frontend Pages:        13 HTML files │
│ Database Records:      2-4 per type  │
│ Authentication:        Token-based   │
│ Session Management:    localStorage  │
│ Response Format:       JSON          │
│ Concurrent Users:      Unlimited*    │
└──────────────────────────────────────┘
```
