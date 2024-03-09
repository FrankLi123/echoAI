import axios from "axios";

export async function chatTo(
  model_id: string,
  FLOCK_BOT_ENDPOINT: string,
  FLOCK_BOT_API_KEY: string,
  prompt: string,
  chat_history: string[]
) {
  console.log("Prompt:", prompt);

  try {
    // Construct the request payload
    const payload = {
      question: prompt,
      chat_history: chat_history,
      knowledge_source_id: model_id,
    };

    // Set the headers
    const headers = {
      "x-api-key": FLOCK_BOT_API_KEY,
    };

    // Send POST request using axios
    const response = await axios.post(FLOCK_BOT_ENDPOINT, payload, {
      headers,
    });
      
    // Check if the request was successful
    if (response.status === 200) {
      // Return the answer
      return response.data.answer;
    } else {
      console.error("Request failed with status code:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


