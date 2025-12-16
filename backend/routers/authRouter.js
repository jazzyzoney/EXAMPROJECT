import { Router } from "express"
import { comparePassword, hashedPassword } from "../util/encryption.js"
import db from "../database/connection.js"
import { sendEmail } from "../util/mailer.js"

const router = Router()

router.post("/api/signup", async (req, res) => {
    const { email, password } = req.body

    const userExists = await db.get("SELECT * FROM users WHERE email = ?", [email])
    
    if (userExists) {
        return res.status(400).send({ message: "User already exists" })
    }

    const hashedPwd = await hashedPassword(password)

    const result = await db.run(
        "INSERT INTO users (email, password, login_count) VALUES (?, ?, 0)", 
        [email, hashedPwd]
    )

    sendEmail(
        email,
        "Welcome to Stilesville's hottest forum!", 
        "Thanks for signing up. We are glad to have you."
    )

    res.send({ message: "User created", id: result.lastID })
})

router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await db.get(
        "SELECT * FROM users WHERE email = ?", 
        [email]
    ) 
    
    if (!user) {
        return res.status(400).send({ message: "Invalid credentials" })
    }

    const isSame = await comparePassword(password, user.password)

    if (!isSame) {
        return res.status(400).send({ message: "Invalid credentials" })
    }

    const isFirstLogin = (user.login_count === 0)

    await db.run("UPDATE users SET login_count = login_count + 1 WHERE id = ?", [user.id])

    if (isFirstLogin) {
        console.log("🚨 First login detected. Sending alert...")
        sendEmail(
            email,
            "Security Alert: First Login",
            "We noticed your first login to the system."
        )
    }

    if (req.session) {
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
    res.json({ message: "Logged in", role: user.role, isFirstLogin })
})

router.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.send({ message: "Logged out" })
    })
})

router.get("/api/auth-check", (req, res) => {
    if (req.session.user) {
        res.send({ user: req.session.user })
    } else {
        res.status(401).send({ message: "Not logged in" })
    }
})

// delete user ?
//router.delete("/api/")

export default router