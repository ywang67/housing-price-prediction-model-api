# Full-Stack Interview Tasks

## Task 1: Housing Price Prediction Model API

### Objective

Build, containerise, and deploy a simple regression model that predicts housing prices from the provided features and dataset.

### API Endpoints

1. `POST /predict`
   - Accept housing features and return price predictions.
   - Support both single-property and batch predictions.
2. `GET /model-info`
   - Return model coefficients and performance metrics.
3. `GET /health`
   - Provide a simple service health check.

### Technical Constraints

- Python 3.12+
- FastAPI
- scikit-learn

### Deliverables

1. Source code hosted on GitHub.
2. A Dockerfile.
3. The ability to demonstrate the live API during the interview through Swagger/OpenAPI.

---

## Task 2: Multi-Application Next.js Portal

### Objective

Create a unified Next.js portal that hosts two independent applications with different backend technologies. Both applications must be able to interact with the ML model from Task 1.

### Portal Structure Requirements

#### 1. Unified Navigation and Layout

- Implement a shared layout with navigation between applications.
- Use the Next.js App Router for routing between and within applications.
- Create a consistent design system across both applications.
- Properly handle loading and error states at the layout level.

#### 2. App 1: Property Value Estimator (Python Backend)

##### Frontend

- Create a form for entering all property details required by the model.
- Implement client-side validation with appropriate error messages.
- Display prediction results in both tabular and chart formats.
- Implement a history feature showing previous estimates.
- Create a comparison view for analysing multiple properties side by side.

##### Backend (Python)

- Handle form submissions.
- Integrate with the regression model container from Task 1.
- Implement data validation and error handling.

#### 3. App 2: Property Market Analysis (Java Backend)

##### Frontend

- Create an interactive dashboard with property-market visualisations.
- Implement filters for analysing different property segments.
- Build a what-if analysis tool that uses the model.
- Provide CSV and PDF export options.
- Create responsive data tables with sorting and filtering.

##### Backend (Java)

- Create REST API endpoints for market analysis.
- Generate aggregate statistics from the housing dataset.
- Integrate with the ML model container from Task 1.
- Implement caching for performance optimisation.

### Technical Requirements

#### 1. Next.js Implementation

- Use the App Router.
- Use Server Components and Client Components appropriately.
- Use React Server Components for initial data loading.
- Implement appropriate data-fetching strategies.
- Create custom hooks for shared functionality.

#### 2. UI and UX

- Create responsive layouts using Tailwind CSS.
- Implement accessible UI components following WCAG guidelines.
- Use appropriate loading states and error boundaries.
- Create smooth transitions between pages and application states.
- Design a cohesive UI that follows modern design principles.

#### 3. State Management and Data Flow

- Use appropriate client-side state management.
- Handle form state effectively with validation.
- Create efficient data-fetching patterns.
- Properly manage API communication and error states.

#### 4. Code Quality and Organisation

- Structure the codebase according to Next.js best practices.

### Technical Constraints

- Python 3.12+
- FastAPI
- Java 21
- Spring Boot 3.4.4

### Deliverables

1. Source code hosted on GitHub.
2. The ability to demonstrate the live portal during the interview.
