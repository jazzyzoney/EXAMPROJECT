import { Router } from 'express'
import db from '../database/connection.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = Router()

// ---------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------
router.get('/api/blogs', async (req, res) => {
    const blogs = await db.all('SELECT * FROM blogs WHERE status = "published" ORDER BY created_at DESC');
    res.json({ data: blogs });
});

router.get('/api/blogs/:id', async (req, res) => {
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ data: blog });
});

// ---------------------------------------------
// PROTECTED ROUTES
// ---------------------------------------------
router.post('/api/blogs', isAdmin, async (req, res) => {
    const { title, content, author, status } = req.body;
    
    try {
        await db.run(
            `INSERT INTO blogs (title, content, author, status) VALUES (?, ?, ?, ?)`,
            [title, content, author, status || 'draft']
        );
        res.json({ message: "Blog saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/blogs/:id', isAdmin, async (req, res) => {
    await db.run('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ message: "Blog deleted." });
});

export default router;