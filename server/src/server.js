import express from "express";
// import cors from "cors"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
// Change these lines in your app.js
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors({
    origin: `${process.env.FRONTEND_URL}` || "http://localhost:5173", // Your frontend URL
    // origin: "http://localhost:5173", // Your frontend URL
    credentials: true // Allow cookies to be sent/received
}));

app.get("/", (_, res) => {
    res.send("server active");
})

import AuthRoutes from "./routes/auth.route.js"
app.use("/api/v1.0/auth", AuthRoutes);


import EventRoutes from "./routes/event.route.js"
app.use("/api/v1.0/events", EventRoutes);



export default app;