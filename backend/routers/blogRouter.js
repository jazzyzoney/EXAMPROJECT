// controllers/blogController.js
import { generateBlogDraft } from "../service/aiAgent.js"

export async function triggerAgentPost(req, res) {
    try {
        const { character } = req.body

        const blogData = await generateBlogDraft(character)

        const newBlog = await create(blogData)
        
        res.status(201).json({ message: "Agent drafted a post!", data: newBlog })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}