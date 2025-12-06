import { Router } from 'express'
import { GoogleGenerativeAI } from "@google/generative-ai"
import db from '../database/connection.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { sendEmail } from '../util/mailer.js'

const router = Router()

//agent personalities
const bratzPersonalities = {
    cloe: {
        name: "Cloe",
        prompt: "You are Cloe from Bratz (Angel). You are dramatic, sweet, and obsessed with animal print and sparkling textures. Write a short blog post (max 150 words) about your day or a fashion trend. Use emojis like 💅✨."
    },
    jade: {
        name: "Jade",
        prompt: "You are Jade from Bratz (Kool Kat). You are the ultimate fashionista, quirky, and cool. You love cats and extreme sports. Write a blog post (max 150 words) about a new edgy trend. Use emojis like 🐱⚡."
    },
    sasha: {
        name: "Sasha",
        prompt: "You are Sasha from Bratz (Bunny Boo). You are the leader, confident, and into hip-hop culture and dance. Write a blog post (max 150 words) about music or confidence. Use emojis like 🎧🔥."
    },
    yasmin: {
        name: "Yasmin",
        prompt: "You are Yasmin from Bratz (Pretty Princess). You are boho-chic, love nature, poetry, and vintage clothes. Write a blog post (max 150 words) about inner beauty or nature. Use emojis like 🌸🦋."
    }
}

router.post('/api/ai/generate',isAdmin, async (req, res) => {

    const { character } = req.body
    const selectedPersona = bratzPersonalities[character]

    if (!selectedPersona) {
        return res.status(400).send("Unknown Bratz character.")
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const result = await model.generateContent(selectedPersona.prompt)
        const aiResponse = result.response.text()

        //saving the response from gemini in the database
        const resultDB = await db.run(
            `INSERT INTO blogs (title, content, author, status) VALUES (?, ?, ?, ?)`,
            [`${selectedPersona.name}'s Update`, aiResponse, selectedPersona.name, 'draft']
        )

       const newPost = {
            id: resultDB.lastID,
            title: `${selectedPersona.name}'s Update`,
            author: selectedPersona.name,
            content: aiResponse
        }

        //socket?
        req.io.emit("new_post_alert", { 
            message: `${newPost.author} just posted: ${newPost.title}!`,
            post: newPost 
        })

        // or are they really fans?
        const subscribers = await db.all("SELECT email FROM users WHERE role = 'user'")
        
        // Loop and send (simplified)
        subscribers.forEach(async (user) => {
            await sendEmail(
                user.email,
                'New blog from ${newPost.author}!',
                '${newPost.author} just posted about: ${newPost.title}. Check it out!'
            )
        })

        res.json({ success: true, blog: newPost })

    } catch (error) {
        console.error("AI Error:", error)
        res.status(500).send("The Agent failed to write the blog.")
    }
})

export default router