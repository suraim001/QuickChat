# QuickChat

QuickChat is a full-stack MERN chat application with real-time messaging, user authentication, profile management, and online-user tracking. The frontend is built with React + Vite, while the backend uses Express.js, Socket.IO, and MongoDB. Users can sign up, log in, update their profile, and chat in real time with other users.

## Overview

This project is designed as a modern real-time chat app with a clean single-page frontend and a lightweight Node.js API backend. It includes:

- User registration and login
- JWT-based authentication
- Real-time online user updates with Socket.IO
- Direct messaging between users
- Unread message tracking
- Profile photo upload via Cloudinary
- Responsive UI for desktop and mobile
- Docker support for local deployment and containerized publishing

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Socket.IO Client
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT
- bcryptjs
- Cloudinary

### DevOps / Deployment
- Docker
- Docker Compose
- Docker Hub

## Project Structure

```text
mern-chatapp/
├── client/
│   ├── context/
│   ├── public/
│   ├── src/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Features

### Authentication
- User signup and login flow
- JWT token generation and validation
- Protected routes for authenticated users

### Messaging
- Fetch all users except the logged-in user
- Load chat history by conversation
- Send text messages
- Send image messages using Cloudinary
- Mark messages as seen
- Real-time notifications using Socket.IO

### User Profiles
- Update full name, bio, and profile image
- Display avatar and user information in the UI

### Real-time status
- Track online users in real-time
- Instant message delivery to connected sockets

## Environment Variables

Create a `.env` file inside the `server` folder with the following values:

```env
MONGODB_URI="your_mongodb_connection_string"
PORT=5000
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

For the frontend, create a `.env` file inside the `client` folder:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Note: `VITE_` variables are read at build time by Vite, so the frontend image must be built with the correct backend URL.

## Local Development Setup

### Prerequisites
- Node.js 20+
- npm
- MongoDB Atlas account or local MongoDB instance
- Docker and Docker Compose (optional, for containerized deployment)

### 1) Clone the project

```bash
git clone <your-repository-url>
cd mern-chatapp
```

### 2) Install backend dependencies

```bash
cd server
npm install
```

### 3) Install frontend dependencies

```bash
cd ../client
npm install
```

### 4) Configure environment variables

Create the `.env` files described above in both the `server` and `client` folders.

### 5) Start the backend

```bash
cd ../server
npm run dev
```

### 6) Start the frontend

```bash
cd ../client
npm run dev
```

### 7) Open the project

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Docker Deployment

This project already includes Dockerfiles and a Docker Compose setup.

### Build and run with Docker Compose

From the project root:

```bash
docker compose up --build -d
```

Then open:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

To stop the containers:

```bash
docker compose down
```

### Run the published Docker Hub images

The project is published to Docker Hub using these image tags:

- `suraim001/quick-chat-server:latest`
- `suraim001/quick-chat-client:latest`

#### Run the backend container

```bash
docker run -d \
  --name quick-chat-server \
  -p 5000:5000 \
  --env-file ./server/.env \
  suraim001/quick-chat-server:latest
```

#### Run the frontend container

```bash
docker run -d \
  --name quick-chat-client \
  -p 3000:80 \
  suraim001/quick-chat-client:latest
```

If you need to rebuild the frontend image with a different backend URL, use:

```bash
docker build \
  --build-arg VITE_BACKEND_URL=http://localhost:5000 \
  -t suraim001/quick-chat-client:latest ./client
```

## Docker Compose File

The project uses a Compose file at the root for local orchestration. It starts the backend and frontend together and wires them through the local network.

## Notes

- Do not commit your live `.env` files to GitHub.
- Keep secrets like MongoDB connection strings, JWT secrets, and Cloudinary credentials in local environment files or your deployment platform secrets manager.
- For production, use secure environment variables and avoid exposing secret values in Docker image builds.

## License

This project is for personal and learning purposes unless otherwise specified.

## Author

Fawaj Suraim
