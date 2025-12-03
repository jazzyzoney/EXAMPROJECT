import { Router } from 'express';
import db from '../database/connection.js';

const router = Router();

// ==========================================
// 1. GET ALL BLOGS
// ==========================================
router.get('/api/blogs', async (req, res) => {
    try {
        //
        const statusFilter = req.query.status;
        
        let query = 'SELECT * FROM blogs ORDER BY created_at DESC';
        let params = [];

        if (statusFilter) {
            query = 'SELECT * FROM blogs WHERE status = ? ORDER BY created_at DESC';
            params = [statusFilter];
        }

        const blogs = await db.all(query, params);
        
        res.json({ data: blogs });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// ==========================================
// 2. GET SINGLE BLOG
// ==========================================
router.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
        
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.json({ data: blog });
    } catch (error) {
        res.status(500).json({ error: "Error reading blog post" });
    }
});

// ==========================================
// 3. CREATE / PUBLISH POST
// ==========================================
router.post('/api/blogs', async (req, res) => {
    // SECURITY CHECK
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, content, author, status } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await db.run(
            `INSERT INTO blogs (title, content, author, status) VALUES (?, ?, ?, ?)`,
            [title, content, author, status || 'published']
        );

        res.status(201).json({ 
            message: "Blog created successfully", 
            id: result.lastID 
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to create blog" });
    }
});

// ==========================================
// 4. UPDATE POST
// ==========================================
router.put('/api/blogs/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    const { status, content, title } = req.body;
    const blogId = req.params.id;

    try {

        await db.run(
            `UPDATE blogs SET status = ?, title = ?, content = ? WHERE id = ?`,
            [status, title, content, blogId]
        );

        res.json({ message: "Blog updated successfully" });

    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
});

// ==========================================
// 5. DELETE POST
// ==========================================
router.delete('/api/blogs/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        await db.run('DELETE FROM blogs WHERE id = ?', [req.params.id]);
        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});

export default router;