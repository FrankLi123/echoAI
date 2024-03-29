import { promisify } from 'util';
import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';

// const chatPrompt = "Respond to a chat according to your background material, and the chat history of that user";


export async function chatTo(
  model_id: string,
  FLOCK_BOT_ENDPOINT: string,
  FLOCK_BOT_API_KEY: string,
  chat_history: string[],
  message: string
) {
  console.log("message:", message);
  console.log("Model ID:", model_id);
  const chatPrompt = "please just answer the question to the user, question: " + message;
  try {
    // Construct the request payload
    const payload = {
      question: `${chatPrompt}`,
      chat_history: [],
      knowledge_source_id: model_id, // replace with your model id
    };

    // Set the headers
    const headers = {
      "x-api-key": FLOCK_BOT_API_KEY, // Ensure API key is set in .env
    };

    // Send POST request using axios
    const response = await axios.post(
      `${FLOCK_BOT_ENDPOINT}/chat/conversational_rag_chat`,
      payload,
      {
        headers,
      }
    );
      
    // Check if the request was successful
    if (response.status === 200) {
      // Return the answer
      return response.data.answer;
    } else {
      console.error("Request failed with status code:", response.status);
    }
  } catch (error) {
    console.error("Flock API Error:", (error as Error).message);
  }
}

// to-do: implement the verifySecret()


// createModel() function
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

async function submitFixedTextFile(modelId: string, walletAddress: string): Promise<void> {
  const tempFilePath = 'fixed_message.txt';
  const fixedContent = 'testing message';

  // Create a temporary txt file with the fixed content
  await writeFileAsync(tempFilePath, fixedContent, 'utf8');

  const formData = new FormData();
  formData.append('file', fs.createReadStream(tempFilePath), {
    filename: tempFilePath,
    contentType: 'text/plain',
  });

  try {
    const response = await axios.post(
      `https://rag-chat-ml-backend-dev.flock.io/contribute/submit_file?file_type=txt&model_id=${modelId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'accept': 'application/json',
          'x-api-key': walletAddress,
        },
      },
    );
    console.log('File submitted successfully:', response.data);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.error('Error message:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
}
}




export async function VerifyBot(
  model_id: string,
  FLOCK_BOT_ENDPOINT: string,
  FLOCK_BOT_API_KEY: string,
  prompt: string,
) {
  // console.log("message:", chat_history[chat_history.length - 1]);
  console.log("Model ID:", model_id);
  // const chatPrompt = "please summarize in 2 words from the user's answer. The user's answer is:" + chat_history[0];
  try {
    // Construct the request payload
    const payload = {
      question: prompt,
      chat_history: [],
      knowledge_source_id: model_id, // replace with your model id
    };

    // Set the headers
    const headers = {
      "x-api-key": FLOCK_BOT_API_KEY, // Ensure API key is set in .env
    };

    // Send POST request using axios
    const response = await axios.post(
      `${FLOCK_BOT_ENDPOINT}/chat/conversational_rag_chat`,
      payload,
      {
        headers,
      }
    );
      
    // Check if the request was successful
    if (response.status === 200) {
      // Return the answer
      return response.data.answer;
    } else {
      console.error("Request failed with status code:", response.status);
    }
  } catch (error) {
    console.error("Flock API Error:", (error as Error).message);
  }
}