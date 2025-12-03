import { Router } from "express"
import nodemailer from "nodemailer"

const router = Router()

//ethereal
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'fyrimcr3rrp5b5gr@ethereal.email',
        pass: 'mAszfyQCG689RXHSRR'
    }
})

router.post("/api/send-email", async (req, res) => {
    const { email, type } = req.body;
    
    let subject = "Notification";
    let text = "This is an alert.";

    if (type === "signup") {
        subject = "Welcome to the system!"
        text = "Thanks for signing up. We are glad to have you."
    } else if (type === "first_login") {
        subject = "Security Alert: First Login"
        text = "We noticed your first login to the system."
    }

    try {
        const info = await transporter.sendMail({
            from: '"Node System" <no-reply@system.com>',
            to: email,
            subject: subject,
            text: text,
            html: `<b>${text}</b>`
        })

        //logs the fake email URL
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        
        res.send({ message: "Email sent" })
    } catch (error) {
        console.error("Email Error:", error)
        res.status(500).send({ message: "Failed to send email" })
    }
})

export default router