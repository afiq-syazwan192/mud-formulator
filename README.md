# Mud Formulator

A web application for formulating and managing drilling mud compositions. This application helps engineers and technicians create, manage, and optimize drilling mud formulations.

## Features

- User authentication (signup/login)
- Create and manage mud formulations
- Add and manage drilling mud products
- Calculate mud properties
- Secure API endpoints
- Modern React frontend with Material-UI
- TypeScript support for better type safety

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React
- TypeScript
- Material-UI
- Axios for API calls
- React Router for navigation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- Git

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd mud-formulator
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
- Create `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mud-formulator
JWT_SECRET=your-secret-key
```

- Create `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Auth Routes
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Product Routes
- GET /api/products - Get all products
- POST /api/products - Create a new product
- DELETE /api/products/:id - Delete a product

### Formulation Routes
- GET /api/formulations - Get all formulations
- POST /api/formulations - Create a new formulation
- DELETE /api/formulations/:id - Delete a formulation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 