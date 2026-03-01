# Test - Govtech Singapore

A RESTful API for managing teachers, students, and their relationships, built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**.

> **Live Demo:** [https://test-govtechsg.vercel.app](https://test-govtechsg.vercel.app)

---

## Requirements

- [Node.js](https://nodejs.org/) v24
- [Yarn](https://yarnpkg.com/) v1.22 _(optional, npm works too)_
- MySQL

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd test_govtechsg
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then fill in your database credentials inside `.env`:

```env
APP_NAME="Test Govtech Singapore"
PORT=3000
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=test_govtechsg
```

### 4. Set up the database

**Option A — Run migrations** _(if you have a fresh MySQL database ready)_

```bash
yarn prisma:migrate
# or
npm run prisma:migrate
```

**Option B — Import the provided database dump** _(if you want to use the pre-seeded data)_

```bash
# Extract and import the dump
gunzip test_govtechsg.gz
mysql -u <user> -p <database_name> < test_govtechsg.dump
```

### 5. Run the development server

```bash
yarn dev
# or
npm run dev
```

The API will be available at **http://localhost:3000**

---

## Available Scripts

| Script | Description |
|---|---|
| `yarn dev` | Start development server with hot-reload |
| `yarn build` | Compile TypeScript to JavaScript |
| `yarn start` | Run the compiled production build |
| `yarn prisma:migrate` | Run Prisma migrations |
| `yarn prisma:generate` | Generate Prisma client |
| `yarn prisma:seed` | Seed the database |
| `yarn test` | Run unit tests |
| `yarn test:watch` | Run unit tests in watch mode |

---

## Architecture

This project follows a **modular architecture with Repository Pattern**. Each module is self-contained with its own controller, service, repository, validation, and interface layers.

```
src/
├── modules/
│   ├── teacher/
│   │   ├── teacher.controller.ts
│   │   ├── teacher.service.ts
│   │   ├── teacher.repository.ts
│   │   ├── teacher.validation.ts
│   │   └── teacher.interface.ts
│   ├── student/
│   │   ├── student.controller.ts
│   │   ├── student.service.ts
│   │   ├── student.repository.ts
│   │   ├── student.validation.ts
│   │   └── student.interface.ts
│   └── teacher-student/
│       ├── teacher-student.controller.ts
│       ├── teacher-student.service.ts
│       ├── teacher-student.repository.ts
│       ├── teacher-student.validation.ts
│       └── teacher-student.interface.ts
├── routes/
├── middlewares/
├── config/
└── index.ts
```

### Modules

| Module | Description |
|---|---|
| **Teacher** | CRUD operations for teachers |
| **Student** | CRUD operations for students |
| **Teacher Student** | Business logic for the 4 user story test cases |

The **Teacher Student** module covers the following user stories:

- **Case 1** — `POST /api/register` — Register one or more students to a teacher
- **Case 2** — `GET /api/commonstudents` — Retrieve students common to a given list of teachers
- **Case 3** — `POST /api/suspend` — Suspend a specified student
- **Case 4** — `POST /api/retrievefornotifications` — Retrieve a list of students who can receive a given notification

---

## API Endpoints

### Teacher

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/teachers` | Get all teachers (`?include_students=true` optional) |
| GET | `/api/teachers/:id` | Get teacher by ID |
| POST | `/api/teachers/email` | Get teacher by email |
| POST | `/api/teachers` | Create a new teacher |
| PUT | `/api/teachers/:id` | Update a teacher |
| DELETE | `/api/teachers/:id` | Delete a teacher |

### Student

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get all students (`?include_teachers=true` optional) |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students/email` | Get student by email |
| POST | `/api/students` | Create a new student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Teacher Student (User Stories)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register students to a teacher |
| GET | `/api/commonstudents` | Get common students across teachers |
| POST | `/api/suspend` | Suspend a student |
| POST | `/api/retrievefornotifications` | Get notification recipients |

---

## Postman Collection

A fully documented Postman collection is included in the repository:

```
Test - Govtech Singapore.postman_collection.json
```

Import it into Postman and set the `app_url` variable to:
- **Local:** `http://localhost:3000`
- **Production:** `https://test-govtechsg.vercel.app`

---

## Testing

Unit tests are written with **Jest** and **ts-jest**, covering the service layer of all three modules.

```bash
yarn test
```

Tests mock the repository layer, so no database connection is required to run them.
