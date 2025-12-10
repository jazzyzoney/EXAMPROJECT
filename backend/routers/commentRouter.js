import { Router } from 'express'
import db from '../database/connection.js'

const router = Router()

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

export default router