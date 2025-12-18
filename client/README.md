This README covers your **Centralized Event Management System**. It is structured for developers or recruiters to understand the full-stack architecture, from the atomic MongoDB updates to the React Context state management.

---

# 📅 EventSphere: Centralized Management System

A full-stack Event Management platform built with the **MERN** stack (MongoDB, Express, React, Node.js). The system features a robust dashboard for users to discover, join, and manage community gatherings with real-time state synchronization.

## 🚀 Key Features

### 🛠 Event Management (CRUD)

- **Dynamic Creation:** Upload event banners directly to **Cloudinary** via Multer.
- **Intelligent Editing:** Pre-filled forms using URL parameters (`/:id`) to fetch "single source of truth" data.
- **Instant Deletion:** Clean removal of events with automatic image cleanup from Cloudinary storage.

### 👥 Participation Engine

- **Atomic Joining:** Backend logic ensures users cannot join twice and prevents overbooking beyond capacity using MongoDB `$expr`.
- **Membership States:** \* **Owner:** Can Edit/Delete.
- **Member:** Can view status and "Leave" the event.
- **Guest:** Can "Join Now."

### 📱 User Interface

- **Optimized Imagery:** High-clarity images using CSS `object-cover` and lazy loading.
- **Centralized State:** Powered by **React Context API** to ensure that joining an event on one page updates the status across the entire app instantly.
- **Glassmorphism Design:** Modern UI with Tailwind CSS, featuring 2.5rem rounded corners and smooth transitions.

---

## 🏗 Technical Stack

| Layer        | Technology                                                     |
| ------------ | -------------------------------------------------------------- |
| **Frontend** | React, Tailwind CSS, React Router v6, Lucide/FontAwesome Icons |
| **Backend**  | Node.js, Express.js                                            |
| **Database** | MongoDB (Mongoose ODM)                                         |
| **Storage**  | Cloudinary (Image Hosting)                                     |
| **Auth**     | JWT (JSON Web Tokens) with custom Middleware                   |

---

## 🚦 API Endpoints

### Events

- `POST /api/events` - Create event (Multipart/form-data)
- `GET /api/events` - Fetch all events
- `GET /api/events/upcoming` - Filter future events
- `GET /api/events/my-events` - Fetch events owned by the logged-in user
- `GET /api/events/:eventId` - Get single event details
- `PUT /api/events/:eventId` - Update event and/or image
- `DELETE /api/events/:eventId` - Delete event and Cloudinary assets

### Actions

- `POST /api/events/:eventId/join` - Atomic join logic
- `POST /api/events/:eventId/leave` - Remove user from participant list

---

## 🛠 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/eventsphere.git

```

2. **Environment Variables (`.env`)**
   Create a file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

```

3. **Install Dependencies**

```bash
# Backend
npm install
# Frontend
cd client && npm install

```

4. **Run Application**

```bash
# From root
npm run dev

```

---

## 📷 Component Architecture

- **`EventContext`**: The heart of the app. Manages `events`, `myEvents`, and `loading` states.
- **`EventCard`**: The primary interactive component for browsing.
- **`MyEventCard`**: Specialized management card for creators.
- **`EditEvent`**: Secure form that validates ownership before allowing updates.

---

## 🛡 Security Highlights

- **JWT Middleware**: All event modifications require a valid token.
- **Ownership Guard**: Backend verifies `event.ownerId === req.user.id` before processing updates or deletions.
- **Input Sanitization**: Mongoose schemas enforce data types and required fields.

---
