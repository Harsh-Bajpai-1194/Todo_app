# Todo App

This is a full-stack Todo application featuring a Node.js backend with Express and MongoDB.

## Project Structure

- **server/**: Contains the backend code.
  - `server.js`: Application entry point.
  - `db.js`: Database connection logic.
  - `auth.js`: Authentication routes and middleware.
  - `users.js`: User registration routes.
  - `todos.js`: Todo CRUD routes.
  - `User.js`, `Todo.js`: Mongoose data models.
- **app.js**: Frontend logic.

## Setup Instructions

### Backend

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the server:
    ```bash
    npm run dev
    ```

## API Endpoints

| Method | Endpoint       | Description           | Access  |
| :----- | :------------- | :-------------------- | :------ |
| POST   | /api/users     | Register a user       | Public  |
| POST   | /api/auth      | Login user            | Public  |
| GET    | /api/auth      | Get logged in user    | Private |
| GET    | /api/todos     | Get all user todos    | Private |
| POST   | /api/todos     | Add a new todo        | Private |
| PUT    | /api/todos/:id | Update a todo         | Private |
| DELETE | /api/todos/:id | Delete a todo         | Private |