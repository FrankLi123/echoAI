import express from "express";
import axios from "axios";
import * as dotenv from "dotenv";
import {initializeDatabase, getChatHistory, appendChatHistory, addUserChatbot, getChatbot, getChatbotsByUser} from "./db";

// Load environment variables
dotenv.config();

// set the local variable to avoid undefined value
const FLOCK_BOT_ENDPOINT: string = process.env.FLOCK_BOT_ENDPOINT || "none";
const FLOCK_BOT_API_KEY: string = process.env.FLOCK_BOT_API_KEY || "none";

const app = express();
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
        const response = "message processed"; // replace this with actual processing
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
        const model_id = "model_id_generated"; // replace this with actual model id generation
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
