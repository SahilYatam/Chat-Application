# 💬 Real-Time Chat Application

A full-stack real-time chat application with controlled communication, notifications, and scalable backend architecture.

---

## 🌐 Live Demo

👉 [Web Chat-App](https://chat-application-ruby-iota.vercel.app)

---

## 🧠 Overview

This application enables users to communicate in real-time with a controlled friend-based system. Users must send and accept friend requests before messaging, ensuring privacy and structured interactions.

The system is designed with a modular backend architecture, separating concerns across controllers, services, and repositories.

---

## ⚙️ Key Features

* 🔐 JWT authentication with session management
* 👥 Friend request system with access control
* 💬 Real-time messaging using Socket.IO
* 🔔 Notification system with background processing
* 📩 Message operations (send, edit, delete, read status)
* 📜 Cursor-based pagination & infinite scrolling

---

## ⚙️ Setup Instructions

```bash
# Clone repo
git clone https://github.com/SahilYatam/Chat-Application

# Install dependencies
cd backend
npm install

cd frontend
npm install

# Run backend
npm run dev

# Run frontend
npm run dev
```

---

## 🏗️ Architecture

### Backend Structure

```bash
backend/src/
 ├── config/
 ├── middleware/
 ├── modules/
 │    ├── auth/
 │    ├── chat/
 │    ├── friendRequest/
 │    ├── friendship/
 │    ├── notification/
 │    ├── user/
 ├── queue/
 ├── socket/
 ├── worker/
```

---

### 🧩 Modular Pattern

Each module follows a clean architecture pattern:

* **Controller** → Handles HTTP request/response
* **Service** → Contains business logic
* **Repository** → Handles database operations
* **Model/Schema** → Database structure

Example:

```ts
auth.controller.ts   // request handling
auth.service.ts      // business logic
auth.repository.ts   // DB queries
```

---

## 🔌 API Overview

### Base url:
```
http://localhost:8000/api/v1
```

### 🔐 Auth Routes

```
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
POST   /auth/recover-username
POST   /auth/forgot-password-request
POST   /auth/reset-password/:token
POST   /auth/refresh-access-token
```

---

### 💬 Chat Routes

```
POST   /chat/send-message
GET    /chat/:conversationId
GET    /chat/conversation/:receiverId
PATCH  /chat/edit-message/:chatId/:conversationId
PATCH  /chat/message-read/:conversationId
PATCH  /chat/delete-message/:chatId/:conversationId
```

---

### 🤝 Friend Request Routes

```
POST   /friendRequest/send/:receiverId
GET    /friendRequest/
GET    /friendRequest/:otherUserId
POST   /friendRequest/accept/:requestId
POST   /friendRequest/reject/:requestId
```

---

### 👥 Friendship Routes

```
GET    /friendship/
```

---

### 🔔 Notification Routes

```
GET    /notification/
PATCH  /notification/mark-as-read/:notificationId
DELETE /notification/delete/:notificationId
```

---

### 👤 User Routes

```
GET    /user/
GET    /user/my-profile
GET    /user/search-user
```

---

## 🔄 Real-Time System

* Built using **Socket.IO**
* Supports:

  * Real-time messaging
  * Read receipts
  * Notifications
* Ensures message delivery and synchronization across users

---

## 🧵 Background Processing

* Uses **Redis + BullMQ**
* Handles:

  * Notifications
  * Async tasks
* Improves performance and responsiveness

---

## 🛠️ Tech Stack

### Backend

* Node.js + Express
* MongoDB
* Redis + BullMQ
* Socket.IO
* JWT Authentication

### Frontend

* React (Vite)
* TypeScript
* Redux Toolkit
* TailwindCSS

### DevOps

* Docker
* Render (Backend)
* Vercel (Frontend)

---

## 📌 Future Improvements

* Add group chat support
* Improve message delivery guarantees

---
