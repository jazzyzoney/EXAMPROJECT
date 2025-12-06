import { Router } from "express"
import { sendEmail } from "../util/mailer.js"

const router = Router()

router.post("/api/send-email", async (req, res) => {
    const { email, type } = req.body
    
    let subject = "Notification"
    let text = "This is an alert."

    if (type === "signup") {
        subject = "Welcome to Stilesville's hottest forum!"
        text = "Thanks for signing up. We are glad to have you."
    } else if (type === "first_login") {
        subject = "Security Alert: First Login"
        text = "We noticed your first login to the system."
    }

    const success = await sendEmail(email, subject, text)

    if (success) {
        res.send({ message: "Email sent" })
    } else {
        res.status(500).send({ message: "Failed to send email" })
    }
})

export default router