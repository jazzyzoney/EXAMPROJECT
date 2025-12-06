import express from "express" 
import "dotenv/config" 
import http from "http"
import { Server } from "socket.io"
import cors from "cors"

import session from "express-session" 

const app = express();

const server = http.createServer(app);

app.use(express.json());

//cors
app.use(cors({
    origin: 'http://localhost:5173', // Your Svelte Frontend URL
    credentials: true,               // Allows session cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(session({
    secret: 'SESSION_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
})) 


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

import authRouter from "./routers/authRouter.js" 
app.use(authRouter) 

import mailRouter from "./routers/mailRouter.js"
app.use(mailRouter) 

import blogRouter from "./routers/blogRouter.js"
app.use(blogRouter)

import aiRouter from "./routers/aiRouter.js"
app.use(aiRouter)

// fallback
app.all("/{*splat}", (req, res) => { 
    res.send(`<h1>404</h1> <h3>didnt find a matching route</h3>`)
})

const PORT = 8080 
server.listen(PORT, () => console.log("Server running on port", PORT)) 