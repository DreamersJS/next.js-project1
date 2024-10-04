# Collaborative Whiteboard Application

## Overview

This project is a **Collaborative Whiteboard Application** built using **Next.js** and **Socket.IO** for real-time interaction. The application allows multiple users to collaborate on a virtual whiteboard in real time. It incorporates APIs for backend operations, ensuring seamless data handling and user authentication. This project demonstrates the power of modern web technologies in creating interactive applications.

## Features

- **Real-time Collaboration**: 
  - Utilizes **Socket.IO** for WebSocket connections, enabling users to interact with each other in real time, drawing, and annotating on the whiteboard.

- **API Integration**: 
  - Interacts with various **APIs** for creating, retrieving, and updating whiteboard content. This facilitates operations like saving whiteboard states and managing user sessions.

<!-- - **User Authentication**:
  - Middleware checks for user authentication using cookies, ensuring that only authorized users can access certain features and routes within the application. -->

- **State Management**:
  - Implements **Recoil** for global state management, allowing for efficient state updates and reactivity throughout the application.

- **Next.js App Router**:
  - Leverages Next.js App Router architecture for enhanced routing capabilities, simplifying navigation and page structure.


## Technologies Used

- **Frontend**: 
  - **Next.js** 
  - **React**
  - **Socket.IO** 
  - **Recoil**

- **Backend**: 
  - REST APIs for data handling 

- **Containerization**: 
  - **Docker**

- **Development Tools**:
  - Node.js
  - npm

## Installation

To get started with this project, follow the steps below:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DreamersJS/next.js-project1.git
   cd next.js-project1

2. **Install dependencies**:
    npm install

3. **Set up environment variables**:
    Create a .env file in the root directory and add any necessary environment variables 
    PORT
    NODE_ENV
    NEXT_PUBLIC_SOCKET_URL

4. **Run the application**:
   npm run dev
   or
   docker-compose up --build
The application will start on http://localhost:3000 or on whichever PORT you are using.

## Usage

- Users can draw on the board, and all actions will be synced in real time with other connected users.
- The application require authentication. Ensure to log in to access all features.