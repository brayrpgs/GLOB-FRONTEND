# GLOB-FRONTEND (Quick Report)

![Ionic React](https://img.shields.io/badge/Ionic-React-3880FF?style=flat-square&logo=ionic)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.9-646CFF?style=flat-square&logo=vite)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

A modern, feature-rich project management application built with Ionic React. This application provides comprehensive tools for managing projects, sprints, issues, and team collaboration with real-time notifications and AI-powered analytics.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Using Docker (Recommended)](#using-docker-recommended)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Microservices Architecture](#microservices-architecture)
- [Available Scripts](#available-scripts)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Quick Report** is a comprehensive project management solution designed to streamline team collaboration and project tracking. Built with modern web technologies, it offers a responsive, cross-platform experience with powerful features including:

- Real-time project monitoring and dashboards
- Sprint planning and issue tracking
- Team member management
- AI-powered project analysis
- Data import/export capabilities
- Real-time notifications via Server-Sent Events (SSE)
- Interactive charts and analytics

## Features

### Core Functionality

- **User Authentication & Authorization**
  - Secure login and registration
  - Password recovery system
  - JWT token-based authentication

- **Project Management**
  - Create and manage multiple projects
  - Project dashboard with statistics
  - Real-time project status monitoring
  - Project member management

- **Sprint Planning**
  - Create and track sprints
  - Sprint timelines and progress tracking
  - Sprint performance analytics

- **Issue Tracking**
  - Create and manage issues
  - Multiple issue types support
  - Issue assignment and tracking
  - Issue status management

- **Analytics & Reporting**
  - Interactive charts using Chart.js
  - Project productivity metrics
  - Sprint performance graphs
  - User productivity analytics
  - AI-powered project analysis

- **Data Management**
  - CSV import/export functionality
  - Bulk data operations

- **Real-time Features**
  - Live notifications via SSE
  - Real-time updates

- **Membership & Payments**
  - Membership management
  - Payment information handling

## Architecture

The application follows a microservices architecture with a React-based frontend that communicates with multiple backend services:

```
┌─────────────────────────────────────────────────────────┐
│                    GLOB-FRONTEND                        │
│              (Ionic React Application)                  │
│                    Port: 5173                           │
└──────────────┬──────────────────────────────────────────┘
               │
               ├──────────────────────────────────────────┐
               │                                          │
               ▼                                          ▼
┌──────────────────────────┐              ┌──────────────────────────┐
│  Security Microservice   │              │  Data Application        │
│  (Authentication)        │              │  Microservice            │
│  Port: 3000              │              │  Port: 8000              │
└──────────────────────────┘              └──────────────────────────┘
               │                                          │
               ▼                                          ▼
┌──────────────────────────┐              ┌──────────────────────────┐
│  Import/Export           │              │  Performance AI          │
│  Microservice            │              │  Microservice            │
│  Port: 5184              │              │  Port: 4000              │
└──────────────────────────┘              └──────────────────────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────────┐
                                          │  SSE (Notifications)     │
                                          │  Microservice            │
                                          │  Port: 4001              │
                                          └──────────────────────────┘
```

## Technology Stack

### Frontend Core
- **Ionic Framework** (8.7.6) - Cross-platform UI components
- **React** (19.0.0) - UI library
- **TypeScript** (5.1.6) - Type-safe JavaScript
- **Vite** (7.1.9) - Build tool and development server

### UI & Visualization
- **Chart.js** (4.5.1) - Data visualization
- **react-chartjs-2** (5.3.1) - React wrapper for Chart.js
- **Ionicons** (7.4.0) - Icon library

### Routing & Navigation
- **React Router** (5.3.4) - Client-side routing
- **React Router DOM** (5.3.4) - DOM bindings for React Router

### Mobile & Native Features
- **Capacitor** (7.4.3) - Native runtime
- **Capacitor Plugins**:
  - App (7.1.0)
  - Haptics (7.0.2)
  - Keyboard (7.0.3)
  - Status Bar (7.0.3)

### Development Tools
- **ESLint** (9.20.1) - Code linting
- **Cypress** (13.5.0) - E2E testing
- **Vitest** (3.2.4) - Unit testing
- **Testing Library** - Component testing utilities

### Utilities
- **jwt-decode** (4.0.0) - JWT token parsing
- **date-fns** (4.1.0) - Date manipulation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (20.10.x or higher) and **Docker Compose** (2.x or higher) - For containerized deployment
- **Node.js** (22.14.0 or higher) - For local development
- **npm** (10.x or higher) - Package manager

## Getting Started

### Using Docker (Recommended)

The easiest way to run the entire application stack is using Docker Compose. This will start the frontend along with all required microservices.

1. **Clone the repository**
   ```bash
   git clone https://github.com/brayrpgs/GLOB-FRONTEND.git
   cd GLOB-FRONTEND
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up
   ```

   This command will:
   - Build the frontend container
   - Start all microservice containers
   - Set up networking between services
   - Expose the application on port 5173

3. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

4. **Stop the services**
   ```bash
   docker-compose down
   ```

   To stop and remove volumes (database data):
   ```bash
   docker-compose down -v
   ```

### Local Development

For development without Docker:

1. **Clone the repository**
   ```bash
   git clone https://github.com/brayrpgs/GLOB-FRONTEND.git
   cd GLOB-FRONTEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Ensure microservices are running**
   
   Make sure the following microservices are accessible:
   - Security Service: `http://localhost:3000`
   - Data Application: `http://localhost:8000`
   - Import/Export: `http://localhost:5184`
   - Performance AI: `http://localhost:4000`
   - SSE Notifications: `http://localhost:4001`

## Project Structure

```
GLOB-FRONTEND/
├── cypress/                    # E2E test files
│   ├── e2e/                   # Test specifications
│   ├── fixtures/              # Test fixtures
│   └── support/               # Support files
├── public/                    # Static assets
├── resources/                 # App resources (icons, splash screens)
├── src/                       # Source code
│   ├── common/               # Common constants and configurations
│   │   └── Common.ts         # API URLs and constants
│   ├── components/           # Reusable React components
│   │   ├── aifeedback/       # AI feedback component
│   │   ├── alertproject/     # Project alerts
│   │   ├── footer/           # Footer component
│   │   ├── header/           # Header component
│   │   ├── import/           # Data import component
│   │   ├── issues/           # Issues management
│   │   ├── issuesgraph/      # Issues visualization
│   │   ├── notifications/    # Notification component
│   │   ├── paymentinfo/      # Payment information
│   │   ├── profile/          # User profile
│   │   ├── project/          # Project component
│   │   ├── projectgraph/     # Project graphs
│   │   ├── recover/          # Password recovery
│   │   ├── sprints/          # Sprint management
│   │   ├── sprintsgraph/     # Sprint visualization
│   │   ├── testimonials/     # Testimonials
│   │   ├── toast/            # Toast notifications
│   │   ├── userprograph/     # User productivity graph
│   │   └── users/            # User management
│   ├── enums/                # TypeScript enums
│   ├── Helpers/              # Helper utilities
│   │   ├── FetchHelper.ts    # HTTP methods and response types
│   │   ├── RequestHelper.ts  # Request builder
│   │   └── URLHelper.ts      # URL parsing utilities
│   ├── interfaces/           # TypeScript interfaces
│   │   └── Api.ts            # API interface definition
│   ├── layout/               # Layout components
│   ├── middleware/           # Middleware functions
│   ├── models/               # Data models
│   │   ├── GetIssueType.ts
│   │   ├── GetIssues.ts
│   │   ├── GetProject.ts
│   │   ├── GetSprint.ts
│   │   ├── GetUserProject.ts
│   │   ├── Issue.ts
│   │   ├── IssueType.ts
│   │   ├── Notification.ts
│   │   ├── OTP.ts
│   │   ├── Project.ts
│   │   ├── ProjectAnalysisResponse.ts
│   │   ├── PutUser.ts
│   │   ├── RecoverPassword.ts
│   │   ├── Sprint.ts
│   │   ├── SseData.ts
│   │   ├── TokenPayload.ts
│   │   ├── User.ts
│   │   └── UserProject.ts
│   ├── pages/                # Application pages
│   │   ├── contact/          # Contact page
│   │   ├── error/            # 404/Error page
│   │   ├── landing/          # Landing page
│   │   ├── login/            # Login page
│   │   ├── main/             # Main dashboard
│   │   ├── membership/       # Membership page
│   │   ├── project/          # Project details page
│   │   ├── register/         # Registration page
│   │   ├── reset/            # Password reset page
│   │   └── welcome/          # Welcome page
│   ├── styles/               # CSS modules and styles
│   ├── theme/                # Ionic theme customization
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   │   ├── AnalizeUtils.ts       # Project analysis
│   │   ├── ChangePasswordUtils.ts # Password change
│   │   ├── GraphsUtils.ts        # Graph utilities
│   │   ├── ImportDataUtils.ts    # Data import
│   │   ├── IssueTypeUtils.ts     # Issue type operations
│   │   ├── IssueUtils.ts         # Issue operations
│   │   ├── LoginUtils.ts         # Authentication
│   │   ├── ProductivityUtils.ts  # Productivity metrics
│   │   ├── ProjectsUtils.ts      # Project operations
│   │   ├── QueryAIUtils.ts       # AI query operations
│   │   ├── RecoverPasswordUtils.ts # Password recovery
│   │   ├── SprintUtils.ts        # Sprint operations
│   │   ├── TokenPayloadUtils.ts  # Token handling
│   │   ├── UserProjectUtils.ts   # User-project relations
│   │   └── UserUtils.ts          # User operations
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Application entry point
│   └── setupTests.ts         # Test configuration
├── .dockerignore             # Docker ignore file
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore file
├── capacitor.config.ts       # Capacitor configuration
├── cypress.config.ts         # Cypress configuration
├── Dockerfile                # Docker configuration
├── index.html                # HTML entry point
├── ionic.config.json         # Ionic configuration
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## Microservices Architecture

### 1. Security Microservice (Port 3000)

Handles authentication and user management.

**Base URL:** `http://localhost:3000/api`

**Responsibilities:**
- User registration and login
- JWT token generation and validation
- Password recovery
- User profile management

**Endpoints:**
- `/api/users` - User management
- `/api/users/login` - User authentication
- `/api/recoverPassword` - Password recovery
- `/api/recoverPassword/validate` - OTP validation

### 2. Data Application Microservice (Port 8000)

Core application data management.

**Base URL:** `http://localhost:8000`

**Responsibilities:**
- Project CRUD operations
- Sprint management
- Issue tracking
- User-project associations
- Membership management

**Endpoints:**
- `/projects/` - Project operations
- `/sprints/` - Sprint operations
- `/issues/` - Issue operations
- `/issue-types/` - Issue type management
- `/user-projects/` - User-project relationships
- `/membership/` - Membership management

### 3. Import/Export Microservice (Port 5184)

Handles data import and export operations.

**Base URL:** `http://localhost:5184/api`

**Responsibilities:**
- CSV file import
- Data export
- Bulk data operations

**Endpoints:**
- `/api/csv` - CSV operations

### 4. Performance AI Microservice (Port 4000)

AI-powered analytics and insights.

**Base URL:** `http://localhost:4000`

**Responsibilities:**
- Project performance analysis
- AI-powered insights
- Query processing
- Predictive analytics

**Endpoints:**
- `/analyze` - Project analysis
- `/query` - AI query processing

### 5. SSE Notifications Microservice (Port 4001)

Real-time notification service.

**Base URL:** `http://localhost:4001`

**Responsibilities:**
- Real-time event streaming
- Push notifications
- Live updates

**Endpoints:**
- `/events` - SSE event stream

## Available Scripts

### Development

```bash
# Start development server
npm run dev

# Start development server on all network interfaces (0.0.0.0:5173)
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test.unit

# Run E2E tests with Cypress
npm run test.e2e
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Docker

```bash
# Build Docker image
docker build -t glob-frontend .

# Run container
docker run -p 5173:5173 glob-frontend

# Run with docker-compose (includes all microservices)
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild containers
docker-compose up --build
```

## Environment Configuration

The application uses hardcoded API endpoints defined in `src/common/Common.ts`. For production deployment, these should be configured via environment variables.

### Default Configuration

```typescript
// Security Microservice
BASE_API_SECURITY_URL = 'http://localhost:3000/api'

// Data Application Microservice
BASE_API_DATA_APLICATION_URL = 'http://localhost:8000'

// Import/Export Microservice
BASE_API_IMPORT_EXPORT_URL = 'http://localhost:5184/api'

// Performance AI Microservice
BASE_API_PERFORMANCE_AI = 'http://localhost:4000'

// SSE Notifications Microservice
BASE_API_SSE = 'http://localhost:4001'
```

### Customizing API Endpoints

To change the API endpoints for different environments, modify the values in `src/common/Common.ts`:

```typescript
// Example: Production configuration
export const BASE_API_SECURITY_URL = 'https://api.yourapp.com/security'
export const BASE_API_DATA_APLICATION_URL = 'https://api.yourapp.com/data'
// ... etc
```

## API Endpoints

### Authentication Flow

1. **Register** → POST `/api/users`
2. **Login** → POST `/api/users/login`
3. **Recover Password** → POST `/api/recoverPassword`
4. **Validate OTP** → POST `/api/recoverPassword/validate`

### Project Management Flow

1. **List Projects** → GET `/projects/?project_id={id}`
2. **Create Project** → POST `/projects/`
3. **Update Project** → PATCH `/projects/{id}`
4. **Delete Project** → DELETE `/projects/{id}`

### Sprint Management Flow

1. **List Sprints** → GET `/sprints/`
2. **Create Sprint** → POST `/sprints/`
3. **Update Sprint** → PATCH `/sprints/{id}`
4. **Delete Sprint** → DELETE `/sprints/{id}`

### Issue Management Flow

1. **List Issues** → GET `/issues/`
2. **Create Issue** → POST `/issues/`
3. **Update Issue** → PATCH `/issues/{id}`
4. **Delete Issue** → DELETE `/issues/{id}`

## Testing

### Unit Testing

The project uses Vitest for unit testing:

```bash
npm run test.unit
```

Test files are located alongside components with the `.test.tsx` extension.

### E2E Testing

Cypress is configured for end-to-end testing:

```bash
# Run Cypress in headless mode
npm run test.e2e

# Open Cypress Test Runner (for development)
npx cypress open
```

E2E tests are located in the `cypress/e2e/` directory.

### Test Configuration

- **Vitest config:** `vite.config.ts`
- **Cypress config:** `cypress.config.ts`
- **Test setup:** `src/setupTests.ts`

## Building for Production

### Web Build

```bash
# Compile TypeScript and build with Vite
npm run build
```

The production build will be output to the `dist/` directory.

### Mobile Build

For building mobile applications with Capacitor:

```bash
# Sync web assets to native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

### Docker Production Build

To build a production Docker image:

1. Uncomment the build line in the Dockerfile:
   ```dockerfile
   RUN npm run build
   ```

2. Uncomment the preview command:
   ```dockerfile
   CMD ["npm", "run", "preview"]
   ```

3. Build the image:
   ```bash
   docker build -t glob-frontend:prod .
   ```

## Deployment

### Docker Deployment

1. **Ensure all microservices are configured** in your docker-compose.yml
2. **Set appropriate environment variables** for production
3. **Build and deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment

The application can be deployed to various cloud platforms:

- **AWS:** Use ECS or EKS for container orchestration
- **Google Cloud:** Deploy to Cloud Run or GKE
- **Azure:** Use Azure Container Instances or AKS
- **Heroku:** Deploy using the Heroku container stack

### Static Hosting

For static hosting (web build only):

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to:
   - **Netlify:** Drag and drop or use CLI
   - **Vercel:** Use Vercel CLI or GitHub integration
   - **AWS S3 + CloudFront:** Upload to S3, serve via CloudFront
   - **GitHub Pages:** Use gh-pages or GitHub Actions

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style

- Follow the existing code style
- Run ESLint before committing: `npm run lint`
- Write tests for new features
- Update documentation as needed

### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests after the first line

## License

This project is private and proprietary. All rights reserved.

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using the port
lsof -i :5173

# Kill the process
kill -9 <PID>
```

**Docker containers not starting:**
```bash
# Check container logs
docker-compose logs [service-name]

# Restart containers
docker-compose restart

# Rebuild containers
docker-compose up --build
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Rebuild TypeScript
npm run build
```

## Support

For questions, issues, or support:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## Acknowledgments

- Ionic Framework team for the excellent mobile UI framework
- React team for the powerful UI library
- All contributors and maintainers

---

**Built with ❤️ by the GLOB-FRONTEND team**
