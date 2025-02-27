# Simple Todo Application

A simple Todo application built with Node.js, Express, TypeScript, and MongoDB. This application allows you to create, read, update, and delete todos.

---

## Table of Contents

- [Simple Todo Application](#simple-todo-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Assumptions and Decisions](#assumptions-and-decisions)

---

## Features

- Create a new todo.
- Retrieve a list of todos with pagination and filtering.
- Retrieve a single todo by ID.
- Update an existing todo.
- Delete a todo.
- Unit and integration testing with Jest.
- Linting and formatting with ESLint and Prettier.

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/qbentil/api-testing.git
   cd api-testing
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Set up the environment variables**:
   - Create a `.env` file in the root of the project.
   - Copy the contents of `.env.example` into `.env`.
   - Replace the values with your own MongoDB connection string and server port.
   - Save the file.

4. **Start the application**:
   ```bash
   npm run dev
   ```
   The application should now be running on `http://localhost:{PORT}`.

---

## Usage

**API Endpoints**:

1. *Create a Todo*
Endpoint: POST /api/todo
Request Body:
```json
{
  "title": "Buy groceries",
  "description": "Buy milk, eggs, and bread"
}
```   

Response Body:
```json
{
  "success": true,
  "data": {
    "_id": "60f3b3b3b3b3b3b3b3b3b3b3",
    "title": "Buy groceries",
    "completed": false,
    "description": "Buy milk, eggs, and bread",
    "createdAt": "2021-07-18T12:00:00.000Z",
    "updatedAt": "2021-07-18T12:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

2. *Get Todos*
Endpoint: GET /api/todo
Query Parameters:
- `page` (optional): The page number to retrieve.
- `limit` (optional): The number of todos to retrieve per page.
- `completed` (optional): Filter todos by completion status (true or false).

Response Body:
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f3b3b3b3b3b3b3b3b3b3b3",
      "title": "Buy groceries",
      "completed": false,
      "description": "Buy milk, eggs, and bread",
      "createdAt": "2021-07-18T12:00:00.000Z",
      "updatedAt": "2021-07-18T12:00:00.000Z"
    }
  ],
  "message": "Todos retrieved successfully"
}
```

3. *Get Todo by ID*
Endpoint: GET /api/todo/read/:id

Response Body:
```json
{
  "success": true,
  "data": {
    "_id": "60f3b3b3b3b3b3b3b3b3b3b3",
    "title": "Buy groceries",
    "completed": false,
    "description": "Buy milk, eggs, and bread",
    "createdAt": "2021-07-18T12:00:00.000Z",
    "updatedAt": "2021-07-18T12:00:00.000Z"
  },
  "message": "Todo retrieved successfully"
}
```

4. *Update a Todo*
Endpoint: PUT /api/todo/:id

Request Body:
```json
{
  "title": "Buy groceries",
  "description": "Buy milk, eggs, bread, and cheese",
   "completed": true
}
```

Response Body:
```json
{
  "success": true,
  "data": {
    "_id": "60f3b3b3b3b3b3b3b3b3b3b3",
    "title": "Buy groceries",
    "completed": true,
    "description": "Buy milk, eggs, bread, and cheese",
    "createdAt": "2021-07-18T12:00:00.000Z",
    "updatedAt": "2021-07-18T12:00:00.000Z"
  },
  "message": "Todo updated successfully"
}
```

5. *Delete a Todo*
Endpoint: DELETE /api/todo/delete/:id

Response Body:
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

---

## Testing

The project includes both unit and integration tests.

1. **Run unit tests**:
   ```bash
   npm run test:unit
   ```
   This will run all the unit tests in all directories with the `.test.ts` extension.

2. **Run unit tests with coverage**:
   ```bash
   npm run test:unit:coverage
   ```
   This will run all the unit tests and generate a coverage report in the `coverage` directory.

3. **Run integration tests**:
   ```bash
   npm run test:integration
   ```
   This will run all the integration tests in the `tests` directory with the `.spec.ts` extension.

4. **Run integration tests with coverage**:
   ```bash
   npm run test:integration:coverage
   ```
   This will run all the integration tests and generate a coverage report in the `coverage` directory.

5. **Run all tests**:
   ```bash
   npm test
   ```
   This will run both the unit and integration tests.

6. **Run all tests with coverage**:
   ```bash
   npm run test:coverage
   ```
   This will run both the unit and integration tests and generate a coverage report in the `coverage` directory.

---

## Assumptions and Decisions
1. **Database:**
   - MongoDB is used as the database.
   - MongoDB Memory Server is used for testing to avoid dependency on a real database.

2. **Validation:**
   - Request validation is handled using Joi.

3. **Error Handling:**
   - Errors are propagated to a central error-handling middleware.

4. **Testing:**
   - Unit tests focus on individual functions and modules.
   - Integration tests focus on the API endpoints and their behavior.

5. **Environment Variables:**
   - Sensitive configuration (e.g., database URI) is stored in a .env file.