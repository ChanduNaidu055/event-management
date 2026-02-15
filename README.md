# EventHub - Full Stack Event Management System:

A comprehensive web application for discovering and managing events. This project features a robust Node.js/Express backend with an SQLite database and a modular React.js frontend. It allows users to browse a large collection of events, filter by categories, and manage their personal registration schedules.

# Key Features:

User Authentication: Secure Signup and Login using JWT and Bcrypt for password hashing.

Event Discovery: A dynamic landing page to browse events with real-time search and category filtering.

Registration System: Logged-in users can register for events with automated capacity checks.

User Dashboard: A personalized view where users can see their upcoming events and cancel registrations.

Responsive UI: A clean, modular design built with CSS-in-Component architecture.

Helper Utilities: Includes a custom Seed API to quickly populate the database with dummy data for testing.

# Tech Stack:

# Frontend:

1 React.js (Functional Components & Hooks)
2 React Router DOM (Navigation)
3 Context API (State Management)
4 CSS (Modular Styling)

# Backend:

1 Node.js & Express.js
2 SQLite (Database)
3 JWT & BcryptJS (Security)
4 CORS & Dotenv

# Project Structure :

EventManagement/
├── server/  
│ ├── routes/  
│ ├── middleware/  
│ ├── eventApp.db  
│ └── server.js  
├── client/  
│ ├── src/
│ │ ├── components/  
│ │ ├── pages/  
│ │ ├── context/  
│ │ └── App.js  
└── README.md

# Setup & Installation:

# 1. Backend Setup:

cd server
npm install
node server.js #Start the server

# 2. Frontend Setup:

cd client
npm install
npm start

# Future Improvements:

1 Add an Admin Dashboard for event creation.
2 Integration with Email APIs for registration confirmations.
