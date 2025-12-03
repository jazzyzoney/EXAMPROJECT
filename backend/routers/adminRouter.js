import db from '../db/connection.js'
import { generateBlogDraft } from '../service/aiAgent.js'
import { triggerAgentPost } from './blogController.js';

export default triggerAgentPost = async (req, res) => {
    //get the character name from the form body
    const { character } = req.body; 

    try {
        //ask Gemini to write the post
        const blogData = await generateBlogDraft(character);
        
        //save the result to SQLite
        const result = await db.run(
            `INSERT INTO blogs (title, content, author, status) VALUES (?, ?, ?, ?)`,
            [blogData.title, blogData.content, blogData.author, 'draft']
        )

        console.log(`📝 New draft created by ${blogData.author} (ID: ${result.lastID})`);

        //redirect back to dashboard with a success message
        res.redirect('/admin/dashboard?success=true');

    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating post: " + error.message);
    }
}