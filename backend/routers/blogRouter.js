import { Router } from 'express'
import db from '../database/connection.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { sendEmail } from '../util/mailer.js'

const router = Router()

//agent personalities
const bratzPersonalities = {
    cloe: {
        name: "Cloe",
        prompt: "You are Cloe from Bratz (Angel). You are dramatic, sweet, and obsessed with animal print and sparkling textures. Write a short blog post (150-500 words) about your day or a fashion trend. Use emojis like 💅✨."
    },
    jade: {
        name: "Jade",
        prompt: "You are Jade from Bratz (Kool Kat). You are the ultimate fashionista, quirky, and cool. You love cats and extreme sports. Write a blog post (150-500 words) about a new edgy trend. Use emojis like 🐱⚡."
    },
    sasha: {
        name: "Sasha",
        prompt: "You are Sasha from Bratz (Bunny Boo). You are the leader, confident, and into hip-hop culture and dance. Write a blog post (150-500 words) about music or confidence. Use emojis like 🎧🔥."
    },
    yasmin: {
        name: "Yasmin",
        prompt: "You are Yasmin from Bratz (Pretty Princess). You are boho-chic, love nature, poetry, and vintage clothes. Write a blog post (150-500 words) about inner beauty or nature. Use emojis like 🌸🦋."
    }
}

// create
router.post('/api/blogs/generate',isAdmin, async (req, res) => {
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
        // const subscribers = await db.all("SELECT email FROM users WHERE role = 'user'")
        
        // subscribers.forEach(async (user) => {
        //     await sendEmail(
        //         user.email,
        //         'New blog from ${newPost.author}!',
        //         '${newPost.author} just posted about: ${newPost.title}. Check it out!'
        //     )
        // })

        res.json({ success: true, blog: newPost })

    } catch (error) {
        console.error("AI Error:", error)
        res.status(500).send("The Agent failed to write the blog.")
    }
})

// read
router.get('/api/blogs', async (req, res) => {
    //filtering the blogs
    const { author, status } = req.query

    let query = "SELECT * FROM blogs WHERE 1=1"
    let params = []

    if (author) {
        query += " AND lower(author) = lower(?)"
        params.push(author)
    }
    if (status) {
        query += " AND trim(status) = ?"
        params.push(status.trim())
    }

    query += " ORDER BY created_at DESC"

    const blogs = await db.all(query, params)
    res.json({ data: blogs })
})

// read a single blog
router.get('/api/blogs/:id', async (req, res) => {
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    res.json({ data: blog })
})

// admin routes
// patch 
router.patch('/api/blogs/:id', isAdmin, async (req, res) => {
    const { status, title, content } = req.body

    try {
    //    if (status && !title && !content) {
    //          await db.run('UPDATE blogs SET status = ? WHERE id = ?', [status, req.params.id]);
    //     } 
        // If we are editing content, run the full update

        //const cleanStatus = status ? status.trim() : null;

        await db.run(
            `UPDATE blogs SET 
                status = COALESCE(?, status), 
                title = COALESCE(?, title), 
                content = COALESCE(?, content) 
            WHERE id = ?`,
            [status ? status.trim() : null, title, content, req.params.id]
        )

        res.json({ message: "Blog updated successfully" })
    } catch (error) {
        res.status(500).json({ error: "Update failed" })
    }
})

// delete
router.delete('/api/blogs/:id', isAdmin, async (req, res) => {
    await db.run('DELETE FROM blogs WHERE id = ?', [req.params.id])
    res.json({ message: "Blog deleted." })
})

// comment routes
router.get('/api/comments/:blogId', async (req, res) => {
    try {
        const comments = await db.all(
            "SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at ASC",
            [req.params.blogId]
        )
        res.json({ data: comments })
    } catch (error) {
        res.status(500).json({ error: "failed to fetch comments" })
    }
})

router.post('/api/comments', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "login to comment" })

    const { blogId, content } = req.body
    const { username, role } = req.session.user

    try {
        await db.run(
            `INSERT INTO comments (blog_id, username, content, role) VALUES (?, ?, ?, ?)`,
            [blogId, username, content, role]
        )
        res.json({ success: true, username, role})
    } catch (error) {
        res.status(500).json({ error: "failed to post comment"})
    }
})

// delete comments
router.delete('/api/comments/:id', isAdmin, async (req, res) => {
    await db.run('DELETE FROM comments WHERE id = ?', [req.params.id])
    res.json({ message: "Comment deleted" })
})

export default router