# Blog Backend API

## Overview
This backend service is designed for a blog application, enabling users to manage their blog posts with full CRUD operations and secure authentication.

## Features
- **CRUD Operations**: Create, read, update, and delete blog posts.
- **Authentication**: Secure user authentication with tokens.
- **Data Validation**: Validation of blog post data to ensure correct formatting.
- **Environment Variables**: Configuration using environment variables for enhanced security and flexibility.

## Tech Stack
- **Node.js**: The runtime environment for server-side JavaScript execution.
- **Express.js**: A robust web application framework for Node.js.
- **Prisma**: A modern ORM for Node.js and TypeScript.
- **JWT**: For secure authentication handling.
- **bcrypt**: Utilized for secure password hashing.

## Setup Instructions

### Prerequisites
- Node.js must be installed on your system.
- Access to a PostgreSQL database is required.

### Installation
To set up the project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/KS963000/blogs-backend.git
cd blogs-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="your-database-url"
PORT=3000
JWT_SECRET="your-jwt-secret"
```

Ensure to replace the placeholders with your actual database URL and JWT secret.

## Running the Application

Start the server with the command:

```bash
npm start
```

The server will launch on the port specified in your `.env` file.

## API Endpoints

### Authentication
- `POST /signup`: Registers a new user.
- `POST /signin`: Authenticates a user and issues a JWT.

### Blog Posts
- `POST /blog`: Creates a new blog post (authentication required).
- `GET /blog`: Retrieves all blog posts.
- `GET /blog/:id`: Retrieves a specific blog post by its ID.
- `PUT /blog/:id`: Updates a blog post (authentication required).
- `DELETE /blog/:id`: Deletes a blog post (authentication required).