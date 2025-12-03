// import express from 'express'
// import 'dotenv/config'
// // Import your routers
// // import authRouter from './routers/authRouter.js'
// import aiController from './backend/controller/aiController.js'

// const app = express()

// app.set('view engine', 'ejs')
// app.set('view', './frontend/view')

// app.use(express.static('frontend/public'))
// app.use(express.urlencoded({ extended: true })) // Important for form data!

// // Routes
// // app.use(authRouter);

// // The Admin Route to trigger the AI
// // In a real app, ensure you add middleware to check if user is admin!
// app.post('/admin/generate-draft', aiController.triggerAgentPost)

// app.listen(8080, () => {
//     console.log("Server running on http://localhost:8080")
// })

import express from "express" 
import session from "express-session" 
import "dotenv/config" 

import authRouter from "./routers/authRouter.js" 
import mailRouter from "./routers/mailRouter.js" 
import { getDb } from "./database/connection.js"


const app = express() 

app.use(express.json()) 

//cors without the library
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
})

app.use(session({
    secret: 'SESSION_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
})) 

app.use(authRouter) 
app.use(mailRouter) 

const PORT = 8080 
getDb().then(() => {
app.listen(PORT, () => console.log("Server running on port", PORT)) 
})