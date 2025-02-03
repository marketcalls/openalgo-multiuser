# Frontend

React application for OpenAlgo-Multi User. This directory contains the client-side implementation including UI components, state management, and API integrations.

## Key Components
- React application setup
- Shadcn UI components
- Theme implementation (Light, Dark, Garden)
- WebSocket client
- Real-time monitoring dashboards
- Trading interface
- API analyzer interface

## Project Structure
- `src/components/`: Reusable UI components
- `src/pages/`: Page components for different routes
- `src/services/`: API and other service integrations
- `src/App.js`: Main application component
- `src/index.js`: Application entry point

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add:
```
REACT_APP_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Key Features
- Modern React with Hooks
- Material-UI components
- React Router for navigation
- Axios for API requests
- Responsive design
