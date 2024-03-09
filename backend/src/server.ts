import express from "express";
import axios from "axios";
import * as dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// set the local variable to avoid undefined value
const flock_endpoint: string = process.env.FLOCK_BOT_ENDPOINT || "none";

const app = express();
app.use(cors({
    origin: 'https://echo-ai-zeta.vercel.app'
}));
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Define the API endpoint
app.post("/api/query", async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).send({ error: "Prompt is required" });
    }

    try {
        const payload = {
            question: prompt,
            chat_history: [],
            knowledge_source_id: process.env.FLOCK_BOT_MODEL_ID,
        };

        const headers = {
            "x-api-key": process.env.FLOCK_BOT_API_KEY,
        };

        const response = await axios.post( flock_endpoint , payload, { headers });
        res.send(response.data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
