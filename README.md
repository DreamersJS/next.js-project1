# Collaborative Whiteboard Application

## Overview

This project is a **Collaborative Whiteboard Application** built using **Next.js** and **Socket.IO** for real-time interaction. The application allows multiple users to collaborate on a virtual whiteboard in real time. It incorporates APIs for backend operations, ensuring seamless data handling and user authentication. Featuring drawing tools, image saving/loading, undo/redo and integrated chat.


**DEMO** [Watch on YouTube](https://youtu.be/ivVlTKGkniU) <br/>
![GIF](public/ezgif-2e4ba3c75ec8e4.gif)

## Features


**Whiteboard**
  - Draw with pen, eraser, line, rectangle, circle, triangle.
  - Change color.
  - Fill mode toggle for shapes.
  - Undo/Redo (with Socket.io support).
  - Save and load drawings as images (registered users only).
  - Clear whiteboard (with confirmation).
  - Real-time synchronization with other users via WebSocket.
  - Responsive canvas resizing using ResizeObserver.
  
**Chat**
  - Toggleable chat window. 
  - Real-time messaging via WebSocket. 
  - Unread message counter when chat is minimized. 

- **Real-time Collaboration**: 
  - Utilizes **Socket.IO** for WebSocket connections, enabling users to interact with each other in real time, drawing, and chatting on the whiteboard.

- **API Integration**: 
  - Interacts with various **APIs** for creating, retrieving, and updating whiteboard content. 

- **User Authentication**:
  - Middleware checks for user authentication using cookies, ensuring that only authorized users can access certain features and routes within the application.

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
  - **HTML Canvas**

- **Backend**: 
  - **Firebase** 
  - **Next.js API Routes**: Provides serverless API endpoints, adhering to REST principles
  - **Socket.IO** 

- **Containerization**: 
  - **Docker**

- **Development Tools**:
  - npm

## Installation

To get started with this project, follow the steps below:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DreamersJS/next.js-project1.git
   cd next.js-project1

2. **Install dependencies**:
```bash
    npm install
```

1. **Set up environment variables**:<br/>
    Create a .env file in the root directory and add any necessary environment variables: <br/>
    PORT<br/>
    NODE_ENV<br/>
    NEXT_PUBLIC_SOCKET_URL<br/>
    CLIENT_ORIGIN<br/>
    NEXT_PUBLIC_FIREBASE_API_KEY<br/>
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN<br/>
    NEXT_PUBLIC_FIREBASE_PROJECT_ID<br/>
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET<br/>
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID<br/>
    NEXT_PUBLIC_FIREBASE_APP_ID<br/>
    NEXT_PUBLIC_FIREBASE_DATABASE_URL<br/>

2. **Run the application**:<br/>
```bash
   npm run dev
```
   or
```bash
   docker-compose up --build
```
The application will start on http://localhost:3000 or on whichever PORT you are using.

## Usage

- Users can draw on the board, and all actions will be synced in real time with other connected users in the board.
- The application require authentication. Ensure to log in to access all features. A registered user has more features than a guest.
- Guests & their boards are deleted on logout.