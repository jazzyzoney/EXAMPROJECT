import { Router } from 'express'
import db from '../database/connection.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = Router()

router.get('/api/blogs', async (req, res) => {
    //filtering the blogs
    const { author, status } = req.query
    let query = "SELECT * FROM blogs WHERE 1=1"
    let params = []

    if (author) {
        query += " AND author = ?"
        params.push(author)
    }
    if (status) {
        query += " AND status = ?"
        params.push(status)
    }

    query += " ORDER BY created_at DESC"
    const blogs = await db.all(query, params)
    res.json({ data: blogs })
})

router.get('/api/blogs/:id', async (req, res) => {
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    res.json({ data: blog })
})

// ---------------------------------------------
// PROTECTED ROUTES
// ---------------------------------------------
router.put('/api/blogs/:id', isAdmin, async (req, res) => {
    const { status, title, content } = req.body

    try {
       if (status && !title && !content) {
             await db.run('UPDATE blogs SET status = ? WHERE id = ?', [status, req.params.id]);
        } 
        // If we are editing content, run the full update
        else {
             await db.run(
                `UPDATE blogs SET 
                    status = COALESCE(?, status), 
                    title = COALESCE(?, title), 
                    content = COALESCE(?, content) 
                WHERE id = ?`,
                [status, title, content, req.params.id]
            );
        }
        res.json({ message: "Blog updated successfully" })
    } catch (error) {
        res.status(500).json({ error: "Update failed" })
    }
})

router.delete('/api/blogs/:id', isAdmin, async (req, res) => {
    await db.run('DELETE FROM blogs WHERE id = ?', [req.params.id])
    res.json({ message: "Blog deleted." })
})

export default router