#  Collaborative Code Review Platform API



An API-driven service that enables developers and teams to post code snippets, request feedback, and collaborate on code reviews asynchronously in real time. 

---

## 🗄️ Database Schema & Initialization Scripts

Run these scripts inside the **pgAdmin Query Tool** to set up the structural database tables required for your endpoints.

```sql
-- 1. INITIALIZE ENUM DATA TYPES
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Reviewer', 'Submitter');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
        CREATE TYPE submission_status AS ENUM ('pending', 'in_review', 'approved', 'changes_requested');
    END IF;
END $$;

-- 2. USERS TABLE (Sprint 2)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_picture TEXT,
    role user_role DEFAULT 'Submitter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROJECTS TABLE (Sprint 3)
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PROJECT MEMBERS JUNCTION TABLE (Sprint 3)
CREATE TABLE IF NOT EXISTS project_members (
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

-- 5. SUBMISSIONS TABLE (Sprint 4)
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Submission',
    code TEXT NOT NULL,
    status submission_status DEFAULT 'pending',
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. COMMENTS TABLE (Sprint 5)
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    submission_id INT REFERENCES submissions(id) ON DELETE CASCADE,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    line_number INT DEFAULT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. REVIEW HISTORY TABLE (Sprint 6)
CREATE TABLE IF NOT EXISTS review_history (
    id SERIAL PRIMARY KEY,
    submission_id INT REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users(id) ON DELETE CASCADE,
    action submission_status NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

##  Environment Configuration & Requirements

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org) (v18+) and [PostgreSQL](https://postgresql.org) installed.
2. **Environment File**: Create a `.env` file in the root folder of your project workspace:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PG_PASSWORD@localhost:5432/review_platform
JWT_SECRET=your_super_secure_jwt_secret_phrase
```

3. **Install & Run**:
```bash
npm install
npm run dev
```

---

## Functional API Endpoint Routing Table

| Sprint | Domain Scope | HTTP Method | Endpoint URI Path | Access Rule (RBAC) |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint 2** | Auth | `POST` | `/api/auth/register` | Public |
| **Sprint 2** | Auth | `POST` | `/api/auth/login` | Public |
| **Sprint 2** | Profiles | `GET` | `/api/users/:id` | Authenticated |
| **Sprint 2** | Profiles | `PUT` | `/api/users/:id` | Owner |
| **Sprint 2** | Profiles | `DELETE` | `/api/users/:id` | Owner |
| **Sprint 3** | Projects | `POST` | `/api/projects` | Authenticated |
| **Sprint 3** | Projects | `GET` | `/api/projects` | Authenticated |
| **Sprint 3** | Project Members | `POST` | `/api/projects/:id/members` | Authenticated |
| **Sprint 3** | Project Members | `DELETE` | `/api/projects/:id/members/:userId` | Authenticated |
| **Sprint 4** | Submissions | `POST` | `/api/submissions` | Submitter Only |
| **Sprint 4** | Submissions | `GET` | `/api/projects/:id/submissions` | Authenticated |
| **Sprint 4** | Submissions | `GET` | `/api/submissions/:id` | Authenticated |
| **Sprint 4** | Submissions | `DELETE` | `/api/submissions/:id` | Owner |
| **Sprint 5** | Comments | `POST` | `/api/submissions/:id/comments` | Reviewer Only |
| **Sprint 5** | Comments | `GET` | `/api/submissions/:id/comments` | Authenticated |
| **Sprint 5** | Comments | `PUT` | `/api/comments/:id` | Author Only |
| **Sprint 5** | Comments | `DELETE` | `/api/comments/:id` | Author Only |
| **Sprint 6** | Reviews | `POST` | `/api/submissions/:id/approve` | Reviewer Only |
| **Sprint 6** | Reviews | `POST` | `/api/submissions/:id/request-changes` | Reviewer Only |
| **Sprint 6** | Reviews | `GET` | `/api/submissions/:id/reviews` | Authenticated |

---

##  Sprint-by-Sprint Postman Testing Guide

>  **Note on Authorization**: For all endpoints except Registration and Login, you must copy the `token` received from successful login, go to the **Authorization** tab in Postman, select **Bearer Token**, and paste your token value.

###  Sprint 2: Authentication & User Management

#### 1. User Registration
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/auth/register`
* **Body (raw JSON)**:
```json
{
  "name": "Alice Developer",
  "email": "alice@platform.com",
  "password": "SecurePassword123",
  "role": "Reviewer" 
}
```
*(Note: Create another user with the role `"Submitter"` to test role boundaries later!)*

#### 2. User Login
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/auth/login`
* **Body (raw JSON)**:
```json
{
  "email": "alice@platform.com",
  "password": "SecurePassword123"
}
```

#### 3. Get Profile Details
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/users/1`

#### 4. Update Profile Settings
* **Method**: `PUT`
* **URL**: `http://localhost:3000/api/users/1`
* **Body (raw JSON)**:
```json
{
  "email": "alice.new@platform.com",
  "name": "Alice Smith",
  "display_picture": "https://example.com"
}
```

---

###  Sprint 3: Projects & Workspaces

#### 1. Create a New Project Workspace
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/projects`
* **Body (raw JSON)**:
```json
{
  "name": "E-Commerce Microservice",
  "description": "Backend implementation of payment processing pipeline."
}
```

#### 2. List All Active Projects
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/projects`

#### 3. Assign a Reviewer Member to a Project
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/projects/1/members`
* **Body (raw JSON)**:
```json
{
  "userId": 2
}
```

#### 4. Remove a User Member from a Project
* **Method**: `DELETE`
* **URL**: `http://localhost:3000/api/projects/1/members/2`

---

###  Sprint 4: Code Submissions

#### 1. Create a New Snippet Submission
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/submissions`
* **Body (raw JSON)**:
```json
{
  "title": "paymentGateway.ts",
  "code": "export const processPayment = async (amount: number) => { return stripe.charges.create({ amount }); };",
  "project_id": 1,
  "userId": 2
}
```

#### 2. List Submissions Linked to a Project Workspace
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/projects/1/submissions`

#### 3. View a Single Code Submission Profile
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/submissions/1`

#### 4. Delete an Erroneous Submission Record
* **Method**: `DELETE`
* **URL**: `http://localhost:3000/api/submissions/1`

---

###     Sprint 5: Inline Comments

#### 1. Append a Comment to a Submission (Specific Line or General)
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/submissions/1/comments`
* **Body (raw JSON)**:
```json
{
  "authorId": 2,
  "content": "Make sure to wrap this external integration in a try-catch block to handle network timeouts.",
  "line_number": 1
}
```
*(Leave out `"line_number"` or pass `null` to create a general file comment)*

#### 2. Read All Comments Linked to a Code Submission
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/submissions/1/comments`

#### 3. Edit your Posted Comment Content
* **Method**: `PUT`
* **URL**: `http://localhost:3000/api/comments/1`
* **Body (raw JSON)**:
```json
{
  "authorId": 2,
  "content": "Updated comment: Ensure we also add a retry mechanism here."
}
```

#### 4. Delete your Posted Comment Node
* **Method**: `DELETE`
* **URL**: `http://localhost:3000/api/comments/1`
* **Body (raw JSON)**:
```json
{
  "authorId": 2
}
```

---

###  Sprint 6: Review Workflow Processing

#### 1. Approve Code Submission Status
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/submissions/1/approve`
* **Body (raw JSON)**:
```json
{
  "reviewerId": 2,
  "feedback": "Code clean, unit tests pass. Ready to merge."
}
```

#### 2. Request Operational Changes to Code Submission
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/submissions/1/request-changes`
* **Body (raw JSON)**:
```json
{
  "reviewerId": 2,
  "feedback": "Needs error handling added before this can pass review."
}
```

#### 3. Look up Complete Review Trail Audit History logs
