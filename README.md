# Todo App

This is a full-stack Todo application featuring Node.js backend with Express and MongoDB.

## Project Structure

- **server/**: Contains the backend code.
  - `server.js`: Application entry point.
  - `config/db.js`: Database connection logic.
  - `middleware/auth.js`: Authentication middleware.
  - `routes/`: Contains the API route definitions.
    - `auth.js`: Authentication routes (login, get user).
    - `users.js`: User registration route.
    - `todos.js`: Todo CRUD routes.
  - `models/`: Contains Mongoose data models (`User.js`, `Todo.js`).
- **client/**: Contains the frontend React application.
  - `src/main.jsx`: Client entry point.
  - `src/App.jsx`: Root React component.
  - `src/context/AuthContext.jsx`: Global state management for authentication.
  - `src/context/TodoContext.jsx`: Global state management for todos.
  - `src/components/`: Reusable UI components (e.g., `Navbar`, `TodoForm`, `TodoList`, `TodoFilter`, `TodoItem`).
  - `src/pages/`: Page-level components (e.g., `Login`, `Register`).
  - `src/routing/`: Routing-related components (e.g., `PrivateRoute`).

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

## Running with Docker (Production)

You can run the production-like application stack using Docker Compose. This builds the frontend for production and serves it with Nginx.

1.  Make sure you have Docker and Docker Compose installed.
2.  From the root of the project, run:
    ```bash
    docker-compose up --build
    ```
3.  The application will be available at `http://localhost:8080`.

## Running with Docker (Development)
To run the application with hot-reloading for both frontend and backend, simply run:
    ```bash
    docker-compose up --build
    ```
3.  The application will be available at `http://localhost:5173`. Docker Compose automatically uses `docker-compose.override.yml` to enable the development environment.


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
- [x] **RESTful API Design**: Build a structured API with endpoints like `GET /api/todos`, `POST /api/todos`, `PUT /api/todos/:id` (for toggling completion), and `DELETE /api/todos/:id`.
- [x] **Authentication & Authorization**: Implement secure user login and signup using JSON Web Tokens (JWT) and bcrypt for password hashing. This ensures users can only access their own tasks.
- [x] **Database Integration (MongoDB)**: Use Mongoose to define a Task schema that includes fields for the task description, time, completion status, and a reference to the User ID.

### Phase 2: Frontend Evolution (React) ✅
- [x] Replace the current `index.html` and `app.js` with a component-based React architecture.
- [x] **State Management**: Use the React Context API to manage the global state of tasks and user authentication status.
- [x] **Modern UI/UX**: Upgrade `style.css` by using Tailwind CSS.
- **Features**:
  - [x] **Drag-and-Drop**: Use `@hello-pangea/dnd` to allow users to reorder tasks.
  - [x] **Filtering & Sorting**: Allow users to view "Completed," "Pending," or tasks sorted by time.
  - [x] **Search Functionality**: A real-time search bar to find specific tasks.

### Phase 3: Advanced "FAANG-Ready" Features
To stand out, incorporate complex engineering challenges:
- [x] **Real-time Updates**: Use Socket.io to sync tasks across multiple tabs or devices instantly.
- [x] **Push Notifications**: Integrate the Web Notifications API to remind users of tasks at their specified "time".
- [x] **Data Visualization**: Add a dashboard using Chart.js to show productivity trends (e.g., tasks completed per day).
- [x] **PWA Support**: Convert the app into a Progressive Web App (PWA) so it can be installed on mobile devices and work offline using Service Workers.

### Phase 4: DevOps & Quality Assurance
FAANG companies value engineers who understand the full software development life cycle.
- [x] **Unit & Integration Testing**: Write tests using Jest and React Testing Library to ensure your components and API endpoints work as expected.
 - [x] **CI/CD Pipeline**: Set up GitHub Actions to automatically run tests whenever you push code.
 - [x] **Containerization**: Use Docker to containerize the frontend, backend, and database for consistent environments.
- [ ] **Deployment**: Deploy the backend on AWS (EC2 or Lambda) or Render, and the frontend on Vercel/Netlify.

## Resume Impact Strategy

When listing this on your resume, focus on the technical challenges solved:

> "Developed a full-stack MERN task management system supporting 100+ concurrent users; implemented JWT-based authentication and optimized MongoDB queries, reducing API latency by 30%. Integrated Socket.io for real-time state synchronization and achieved 90%+ test coverage using Jest."