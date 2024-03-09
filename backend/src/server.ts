import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import {initializeDatabase, getChatHistory, appendChatHistory, addUserChatbot, getChatbot, getChatbotsByUser} from "./db";
import { chatTo } from "./chatbot";
import { v4 as uuidv4 } from "uuid";
// Load environment variables
dotenv.config();

// set the local variable to avoid undefined value
const FLOCK_BOT_ENDPOINT: string = process.env.FLOCK_BOT_ENDPOINT || "none";
const FLOCK_BOT_API_KEY: string = process.env.FLOCK_BOT_API_KEY || "none";

const app = express();
app.use(cors({
    origin: 'https://echo-ai-zeta.vercel.app'
}));
const port = process.env.PORT || 3000;

// Initialize the database
initializeDatabase();

app.use(express.json()); // Middleware to parse JSON bodies

// Define the API endpoint
app.post("/api/chat", async (req, res) => {
    const { model_id, user_address, message } = req.body;

    if(!model_id || !user_address || !message) {
        return res.status(400).send({ error: "Required field is missing" });
    }

    try {
        await appendChatHistory(user_address, model_id, message, true);
        const chat_history = await getChatHistory(user_address, model_id);
        const response = await chatTo(model_id, FLOCK_BOT_ENDPOINT, FLOCK_BOT_API_KEY, message, chat_history);
        return res.status(200).send({ message: response, timestamp: new Date() });
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message });
    }
});

// Define the API endpoint
app.get("/api/getAllChatHistory", async (req, res) => {
    const { user_address, model_id } = req.query;

    if(!user_address || !model_id) {
        return res.status(400).send({ error: "Required field is missing" });
    }

    try {
        const history = await getChatHistory(user_address as string, model_id as string);
        return res.status(200).send(history);
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message });
    }
});

// Define the API endpoint
app.post("/api/createBot", async (req, res) => {
    const { user_address, bot_name, material } = req.body;

    if(!user_address || !bot_name || !material) {
        return res.status(400).send({ error: "Required field is missing" });
    }

    try {
        const model_id = uuidv4();
        await addUserChatbot(user_address, model_id, bot_name);
        return res.status(200).send({ model_id, name: bot_name });
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message });
    }
});

// Define the API endpoint
app.get("/api/getAllChatbotsByUser", async (req, res) => {
    const { user_address } = req.query;

    if(!user_address) {
        return res.status(400).send({ error: "User address is required" });
    }

    try {
        const bots = await getChatbotsByUser(user_address as string);
        return res.status(200).send(bots);
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message });
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
