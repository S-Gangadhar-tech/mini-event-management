---

# EventSphere: Centralized Management System

A robust full-stack Event Management platform built with the **MERN** stack. This application focuses on real-time state management, secure event lifecycle control, and high-concurrency RSVP handling.

**🔗 Live Links:**

* **Frontend:** [https://mini-event-management-eight.vercel.app/](https://mini-event-management-eight.vercel.app/)
* **Backend API:** [https://mini-event-management-82zb.vercel.app/](https://mini-event-management-82zb.vercel.app/)

---

## Features Implemented

* **Secure Authentication:** JWT-based login/signup with `httpOnly` cookie storage for production security.
* **Advanced CRUD:** Full event lifecycle management including dynamic image uploads via Cloudinary.
* **Smart Dashboard:** Context-aware views for "All Events," "My Events" (Managed), and "Upcoming Events."
* **Real-time State Sync:** React Context API ensures UI updates (like joining/leaving) reflect instantly across all components.
* **Cloudinary Integration:** Automatic image optimization and server-side cleanup upon event deletion.
* **Responsive Design:** Glassmorphic UI built with Tailwind CSS, optimized for mobile and desktop.

---

##  Technical Strategy: RSVP Capacity & Concurrency

The primary challenge in event management is handling **concurrency**—preventing two users from claiming the last available seat at the exact same millisecond.

### The Solution: Atomic Updates with MongoDB

Instead of a "Fetch-then-Update" approach (which is vulnerable to race conditions), this system uses a **Single Atomic Transactional Update**.

**The Logic:**
We use `Event.updateOne()` with complex filter criteria to ensure the database itself validates capacity before modifying the data.

**Code Implementation:**

```javascript
const result = await Event.updateOne(
    {
        _id: eventId,
        usersJoined: { $ne: userId }, // 1. Ensure user hasn't already joined
        $expr: { $lt: [{ $size: "$usersJoined" }, "$capacity"] } // 2. Capacity Check
    },
    {
        $push: { usersJoined: userId } // 3. Atomic Push
    }
);

```

**Why this works:**

1. **$expr & $lt:** These allow the database to compare the *current* array size against the capacity limit during the write operation.
2. **Atomicity:** Since the check and the push happen in one single operation, MongoDB locks that document. No two requests can bypass the capacity limit simultaneously.
3. **ModifiedCount Validation:** If the capacity was full or the user already joined, `result.modifiedCount` returns `0`, allowing us to send a precise `400 Bad Request` error.

---

## Local Installation & Setup

Follow these steps to run the project in your local development environment:

### 1. Clone the Repository

```bash
[git clone https://github.com/S-Gangadhar-tech/mini-event-management.git]
cd mini-event-management

```

### 2. Configure Environment Variables

Create a `.env` file in the **root (server)** directory:

```env server
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:5173

```

Create a `.env` file in the **root (client)** directory:
```env client
VITE_BACKEND_URL=http://localhost:8080/api/v1.0

```

### 3. Install Dependencies

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd client
npm install

```

### 4. Run the Application

You can run both using `npm run dev` if you have a root `package.json` script, or run them separately:

```bash
# Terminal 1 (Server)
npm start

# Terminal 2 (Client)
npm run dev

```

---

##  Security & Optimization

* **Ownership Guard:** Custom middleware ensures only the `ownerId` can trigger `PUT` or `DELETE` requests for an event.
* **Vercel Serverless Optimization:** Uses `os.tmpdir()` for Multer storage to comply with Vercel's read-only filesystem.
* **Lazy Loading:** Frontend components and images use lazy loading to improve Largest Contentful Paint (LCP) scores.

---
