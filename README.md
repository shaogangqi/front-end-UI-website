# 🌐 Tourism App - Frontend (React + Vite)

This is the **frontend** for the Tourism Ecosystem application, built using **React**, **TypeScript**, **Vite**, and **Material UI**. This app provides a user-friendly interface for exploring accommodations, restaurants, events, transportation, and more.

👉 The **backend** microservice repository can be found here:  
🔗 [Tourism Backend (API)](https://github.com/Yeeoy/microservice-tourism-ecosystem-api)

---

## 📦 Backend Setup (Docker Compose)

The backend services are containerized using Docker and Docker Compose. To run the backend services locally:

### 🐳 Installing Docker & Docker Compose

**Windows**:
- Download from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- Install and follow instructions
- Docker starts automatically after installation

**Mac**:
- Download from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- Open the `.dmg` file and drag Docker to the Applications folder
- Launch Docker and allow required permissions

**Verify Installation** (Terminal / PowerShell):
```bash
docker --version
docker compose version
▶️ Starting Services
Clone the backend repository and run Docker:
git clone https://github.com/Yeeoy/microservice-tourism-ecosystem-api.git
cd microservice-tourism-ecosystem-api
Start the services:

Windows:
docker-compose up --build
Mac:
docker compose up --build
💡 If permission issues occur on Mac, try with sudo.

🔗 Accessing the Backend APIs
Base URL: http://localhost:8000

Auth Service: /api/customUser/

Accommodation: /api/accommodation/

Restaurants: /api/restaurant/

Local Transportation: /api/local-transportation/

Events: /api/event-organizers/

Information Center: /api/information-center/

API Docs & Admin Interface:

Docs: /api/[service-name]/docs/

Admin: /api/[service-name]/admin/

Example:
Auth Docs: http://localhost:8000/api/customUser/docs/
Auth Admin: http://localhost:8000/api/customUser/admin/
🛑 Stopping Services
Press Ctrl + C in your terminal

Or run:
docker compose down
🔐 Authentication
The backend uses JWT (JSON Web Tokens).
To access protected endpoints, include the token in your request header:
Authorization: Bearer <your_jwt_token>
🛠️ Backend Project Details
Each microservice has its own Django project and Dockerfile

Main configuration files:

docker-compose.yml: Defines all microservices

nginx.conf: Configures routing between services

[service]/Dockerfile: Docker config for each service

[service]/[service]/settings.py: Django settings

➕ Adding New Microservices
Create a new folder at root

Initialize Django project/app

Add a Dockerfile

Update docker-compose.yml and nginx.conf

🧪 Running Backend Tests
cd [service-name]
python manage.py test
🎨 Frontend Setup (React + Vite)
🔧 Requirements
Node.js (v16+)

npm or yarn

🚀 Run Locally
git clone https://github.com/your-username/tourism-frontend.git
cd tourism-frontend
npm install
Make sure the backend API URL in src/api/index.ts is set correctly, e.g.:
const BASE_URL = 'http://localhost:8000/api';

Start the frontend:
npm run dev
Frontend runs at http://localhost:3000.

🧩 Frontend Tech Stack
React

Vite

TypeScript

Material UI

React Router DOM