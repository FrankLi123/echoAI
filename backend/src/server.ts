import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import {initializeDatabase, getChatHistory, appendChatHistory, addUserChatbot, getChatbot, getChatbotsByUser, isExistingChatbot} from "./db";
import { VerifyBot, chatTo } from "./chatbot";
import { v4 as uuidv4 } from "uuid";



// Declare a Temperary Cache (store for Registration and Verification Use)
interface ModelResponses {
    [key: string]: any; // or replace `any` with a more specific type based on what `response` contains
  }
  const modelResponses: ModelResponses = {};


// Load environment variables
dotenv.config();

// set the local variable to avoid undefined value
const FLOCK_BOT_ENDPOINT: string = process.env.FLOCK_BOT_ENDPOINT || "none";
const FLOCK_BOT_API_KEY: string = process.env.FLOCK_BOT_API_KEY || "none";

const hostname = process.env.HOSTNAME || "localhost";

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'https://echo-ai-zeta.vercel.app']
}));
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;

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
        const response = await chatTo(model_id, FLOCK_BOT_ENDPOINT, FLOCK_BOT_API_KEY, chat_history, message);
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
    const { user_address, bot_name, material, secrets } = req.body;

    if(!user_address || !bot_name || !material) {
        return res.status(400).send({ error: "Required field is missing" });
    }

    // to-do if there exists a bot with the same name, return the existing bot
    // try {
    //     const isExist = await isExistingChatbot(bot_name);
    //     if(isExist) {
    //         const bot = await getChatbot(bot_name);
    //         return res.status(200).send({ model_id: bot.model_id, name: bot_name });
    //     }
    // } catch (error) {
    //     return res.status(500).send({ error: (error as Error).message });
    // }

    try {
        const model_id = uuidv4();
        // create chatbot using flock-api
        // create verifybot using flock-api

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



app.post("/api/register", async (req, res) => { 
    const { model_id, message, user_address } = req.body;
    
    console.log("hello, /register is triggered.");

    try {
        // let chat_hsitory = [message];
        let prompt =  "please summarize in 2 words from the user's answer. The user's answer is:" + message;
        const response = await VerifyBot(model_id, FLOCK_BOT_ENDPOINT, FLOCK_BOT_API_KEY, prompt);

         // Store the model_id and VerifyBot response
         modelResponses[model_id] = response;
         console.log("Stored model_id and response:", model_id, response);

        return res.status(200).send({ message: response, timestamp: new Date() });
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message });
    }
});


app.post("/api/verify", async (req, res) => { 
    const { model_id, answer, user_address } = req.body;
    // to-do: implement the verifySecret()
    // to-do: transfer NFT to the user
    console.log("hello, /verify is triggered. the message is:", req);

    try{
        let prompt =  "please return True is the user answer matches with the user's traits (else return false). The user answer is:" + answer  + " , the user traits are: " + modelResponses[model_id];
    
        console.log(" '/api/verify', the prompt is: " , prompt);

        const response = await VerifyBot(model_id, FLOCK_BOT_ENDPOINT, FLOCK_BOT_API_KEY, prompt);
        console.log("response is : ", response);

        if (response == "True") {
            return res.status(200).send({verified: true});
        } else {
            return res.status(200).send({verified: false});
        }
    } catch (error) {
        console.error("Error during verification:", error);
        // In case of error, you might want to consider what the default response should be
        // For security reasons, defaulting to false might be safer
        return res.status(500).send({verified: false, error: (error as Error).message});
    }
});




app.post("/api/isRegistered", async (req, res) => { 
    const { model_id } = req.body;
    try {
        // Check if the model_id exists in modelResponses
        if (model_id in modelResponses) {

            console.log("in /api/isRegistered, return true!");
            // If model_id exists, you might want to do additional checks or simply return true
            return res.status(200).send({verified: true});
        } else {
            // If model_id does not exist in modelResponses, return false
            return res.status(200).send({verified: false});
        }
    } catch (error) {
        console.error("Error during verification:", error);
        // In case of error, return false for safety
        return res.status(500).send({verified: false, error: (error as Error).message});
    }
});




app.listen(port, hostname, () => {
    console.log(`Server running on port ${port}`);
});
