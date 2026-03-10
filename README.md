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

## Development Roadmap

### Phase 1: Architecture & Backend (Node.js & Express) ✅
A professional project requires a robust backend instead of relying solely on localStorage.
- **RESTful API Design**: Build a structured API with endpoints like `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id` (for toggling completion), and `DELETE /api/tasks/:id`.
- **Authentication & Authorization**: Implement secure user login and signup using JSON Web Tokens (JWT) and bcrypt for password hashing. This ensures users can only access their own tasks.
- **Database Integration (MongoDB)**: Use Mongoose to define a Task schema that includes fields for the task description, time, completion status, and a reference to the User ID.

### Phase 2: Frontend Evolution (React) 🚧
Replace the current `index.html` and `app.js` with a component-based React architecture.
- **State Management**: Use Redux Toolkit or the React Context API to manage the global state of tasks and user authentication status.
- **Modern UI/UX**: Upgrade `style.css` by using a framework like Tailwind CSS or Material UI.
- **Features**:
  - **Drag-and-Drop**: Use `react-beautiful-dnd` to allow users to reorder tasks.
  - **Filtering & Sorting**: Allow users to view "Completed," "Pending," or tasks sorted by time.
  - **Search Functionality**: A real-time search bar to find specific tasks.

### Phase 3: Advanced "FAANG-Ready" Features
To stand out, incorporate complex engineering challenges:
- **Real-time Updates**: Use Socket.io to sync tasks across multiple tabs or devices instantly.
- **Push Notifications**: Integrate the Web Notifications API to remind users of tasks at their specified "time".
- **Data Visualization**: Add a dashboard using Chart.js to show productivity trends (e.g., tasks completed per day).
- **PWA Support**: Convert the app into a Progressive Web App (PWA) so it can be installed on mobile devices and work offline using Service Workers.

### Phase 4: DevOps & Quality Assurance
FAANG companies value engineers who understand the full software development life cycle.
- **Unit & Integration Testing**: Write tests using Jest and React Testing Library to ensure your components and API endpoints work as expected.
- **CI/CD Pipeline**: Set up GitHub Actions to automatically run tests and deploy the app whenever you push code.
- **Containerization**: Use Docker to containerize the frontend, backend, and database for consistent environments.
- **Deployment**: Deploy the backend on AWS (EC2 or Lambda) or Render, and the frontend on Vercel or Netlify.

## Resume Impact Strategy

When listing this on your resume, focus on the technical challenges solved:

> "Developed a full-stack MERN task management system supporting 100+ concurrent users; implemented JWT-based authentication and optimized MongoDB queries, reducing API latency by 30%. Integrated Socket.io for real-time state synchronization and achieved 90%+ test coverage using Jest."