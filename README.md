# Pulse: Team Collaboration & Project Management Platform

Pulse is a web-based collaboration platform designed to enhance team productivity and streamline project management. Built with a robust Spring Boot backend and a modern React frontend, Pulse empowers teams to manage projects, tasks, and teams efficiently, with real-time updates and AI-driven prioritization.

## Features
- **AI-Driven Task Prioritization**: Dynamically reorder tasks based on deadlines, workload, and urgency using integrated AI.
- **Real-Time Collaboration**: WebSocket-powered instant updates for tasks and document changes.
- **Project & Team Management**: Create, update, and track projects, teams, and members.
- **Email Notifications**: Automated email alerts for team assignments and project updates (via EmailJS).
- **Secure Authentication**: OAuth 2.0 and JWT-based authentication for secure access.
- **Scalable Backend**: High-performance Spring Boot backend supporting 1000+ concurrent users.

## Tech Stack
- **Frontend**: React, Material-UI, Axios, EmailJS
- **Backend**: Spring Boot, Java 17, Spring Data JPA, WebSockets
- **Database**: PostgreSQL
- **Authentication**: OAuth 2.0, JWT
- **AI**: Custom AI logic for task prioritization
- **Deployment**: Docker, Render

## Project Structure
```
Pulse/
├── pul-backend/      # Spring Boot backend (Java)
├── src/              # React frontend (JS)
├── pul-frontend/     # (Additional frontend resources)
├── public/           # Static assets
├── EMAIL_SETUP_GUIDE.md
├── render.yaml       # Render deployment config
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- Java 17
- Maven
- PostgreSQL

### 1. Backend Setup (Spring Boot)
```bash
cd pul-backend
# Configure PostgreSQL in src/main/resources/application.properties
# Build and run
./mvnw spring-boot:run
```
- The backend runs on `http://localhost:8080` by default.

#### Docker (Optional)
```bash
docker build -t pulse-backend .
docker run -p 8080:8080 pulse-backend
```

### 2. Frontend Setup (React)
```bash
cd src
npm install
npm start
```
- The frontend runs on `http://localhost:3000` by default.

### 3. Email Setup (EmailJS)
See [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) for detailed steps.
- Sign up at [EmailJS](https://www.emailjs.com/)
- Create a service and template
- Update `src/config/emailConfig.js` with your EmailJS credentials

## API Endpoints (Backend)
- `GET /api/projects` — List all projects
- `GET /api/projects/{id}` — Get project by ID
- `POST /api/projects` — Create a new project
- `PUT /api/projects/{id}` — Update a project
- `PUT /api/projects/{id}/status` — Update project status
- `DELETE /api/projects/{id}` — Delete a project
- `GET /` or `GET /health` — Health check

## Deployment

### Render
- The project includes a `render.yaml` for Render.com deployment.
- Backend build/start commands are set for Java 17.

### Docker
- See `pul-backend/Dockerfile` for backend containerization.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE) (add a LICENSE file if you wish to specify one)

---

**Pulse** — Empowering teams to collaborate, prioritize, and deliver.
