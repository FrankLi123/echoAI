import pgPromise from 'pg-promise';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pgp = pgPromise();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  database: process.env.DB_NAME || 'echodb',
  user: process.env.DB_USER || 'echo',
  password: process.env.DB_PASSWORD || 'echo',
};

const db = pgp(config);

export async function initializeDatabase() {
    // Connect to db
    db.connect()
    .then(obj => {
        obj.done();
        console.log('Connected to PostgreSQL');
    })
    .catch(error => console.log('ERROR:', error.message));

    // Create ChatHistory table
    const createChatHistoryTable = `
    CREATE TABLE IF NOT EXISTS ChatHistory (
    id UUID PRIMARY KEY,
    user_address VARCHAR(50),
    model_id VARCHAR(50),
    message TEXT,
    timestamp TIMESTAMP,
    is_user BOOLEAN
    );
    `;

    db.none(createChatHistoryTable)
    .then(() => console.log('ChatHistory table created successfully'))
    .catch(error => console.log('ERROR:', error.message));

    // Create Chatbot table
    const createChatbotTable = `
    CREATE TABLE IF NOT EXISTS Chatbot (
    user_address VARCHAR(50),
    model_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50)
    );
    `;

    db.none(createChatbotTable)
    .then(() => console.log('Chatbot table created successfully'))
    .catch(error => console.log('ERROR:', error.message));
}

// Get chat history
export async function getChatHistory(user_address: string, model_id: string) {
  const history = await db.any(
    'SELECT * FROM ChatHistory WHERE user_address=$1 AND model_id=$2 ORDER BY timestamp',
    [user_address, model_id]
  );
  return history.map(entry => (entry.is_user ? 'User' : entry.name) + ': ' + entry.message);
}

// Append chat history
export async function appendChatHistory(user_address: string, model_id: string, message: string, is_user: boolean) {
  const id = uuidv4();
  await db.none(
    'INSERT INTO ChatHistory(id, user_address, model_id, message, timestamp, is_user) VALUES ($1, $2, $3, $4, NOW(), $5)',
    [id, user_address, model_id, message, is_user]
  );
}

// Add a user's chatbot
export async function addUserChatbot(user_address: string, model_id: string, name: string) {
  await db.none(
    'INSERT INTO Chatbot(user_address, model_id, name) VALUES ($1, $2, $3)',
    [user_address, model_id, name]
  );
}

// Get chatbot by model_id
export async function getChatbot(model_id: string) {
  return await db.one(
    'SELECT * FROM Chatbot WHERE model_id=$1',
    [model_id]
  );
}

// Get all chatbots created by a user
export async function getChatbotsByUser(user_address: string) {
  return await db.any(
    'SELECT * FROM Chatbot WHERE user_address=$1',
    [user_address]
  );
}