import { GoogleGenerativeAI } from "@google/generative-ai";
import bratzConfig from "../config/bratzConfig.js";
import 'dotenv/config'; // Loads .env variables

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateBlogDraft(characterName) {
    const character = bratzConfig[characterName];
    
    if (!character) {
        throw new Error(`Character '${characterName}' not found.`);
    }

    try {
        // Send the prompt to Gemini
        const result = await model.generateContent(character.systemPrompt);
        const response = await result.response;
        const text = response.text();

        return {
            title: `${character.role}'s Daily Update!`, //maybe generate title too
            content: text,
            author: characterName.charAt(0).toUpperCase() + characterName.slice(1),
            status: 'draft'
        };

    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate content from Gemini.");
    }
}