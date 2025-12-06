import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔍 Asking Google for available models...");

async function listModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        console.log("\n✅ AVAILABLE MODELS FOR YOU:");
        const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        models.forEach(m => {
            console.log(`   👉 ${m.name.replace('models/', '')}`);
        });

        console.log("\n⚠️ INSTRUCTION: Copy one of the names above exactly into your aiRouter.js");

    } catch (error) {
        console.error("Network Error:", error);
    }
}

listModels();