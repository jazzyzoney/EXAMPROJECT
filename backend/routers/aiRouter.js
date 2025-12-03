import { Router } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from '../database/connection.js';

const router = Router();

// --- 1. CONFIGURATION ---
//agent personalities
const bratzPersonalities = {
    cloe: {
        name: "Cloe",
        prompt: "You are Cloe from Bratz (Angel). You are dramatic, sweet, and obsessed with animal print and sparkling textures. You call your friends 'Angel'. Write a short blog post (max 150 words) about your day or a fashion trend. Use emojis like 💅✨."
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
};

// --- 2. ROUTE ---
router.post('/generate-draft', async (req, res) => {
    //middleware?
    if (!req.session.user) {
        return res.status(401).send("You must be logged in.");
    }

    const { character } = req.body
    const selectedPersona = bratzPersonalities[character];

    if (!selectedPersona) {
        return res.status(400).send("Unknown Bratz character.");
    }

    try {
        // --- 3. AI LOGIC ---
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        //gemini
        const result = await model.generateContent(selectedPersona.prompt);
        const aiResponse = result.response.text();

        // --- 4. DATABASE SAVE ---
        await db.run(
            `INSERT INTO blogs (title, content, author, status) VALUES (?, ?, ?, ?)`,
            [`${selectedPersona.name}'s Update`, aiResponse, selectedPersona.name, 'draft']
        );

        console.log(`✅ Agent ${character} wrote a new draft.`);
        
        //success to frontend
        res.json({ 
            success: true, 
            message: `Draft created by ${character}!`,
            data: { 
                title: `${selectedPersona.name}'s Update`,
                author: selectedPersona.name 
            }
        });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).send("The Agent failed to write the blog.");
    }
});

export default router;