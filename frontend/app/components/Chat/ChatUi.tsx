"use client"
import { ChatInput } from "./ChatInput"
import { Message } from "@/types"
import { useEffect, useRef, useState } from "react"
import { Chat } from "./Chat"
import LoginPage from "../Auth/LoginPage"
import axios from "axios"
import Register from "../Auth/Register"
import Verify from "../Auth/Verify"

interface ChatUiProps {
    accountAddress: string
    botName: string
}
let TEMP_PUBLIC_API_URL = "https://52.35.36.1:8081";

export const ChatUi: React.FC<ChatUiProps> = ({ accountAddress, botName }) => {
    const [modelId, setModelId] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const isMounted = useRef<boolean>(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null)
    const [isVerified, setIsVerified] = useState<boolean | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const createNewChatSession = async () => {
        setMessages([
            {
                role: "assistant",
                content:
                    "Hello, I am Metissa.ai and I am available to answer any questions you may have. Don't hesitate to ask, and I will do my best to provide you with all the assistance I can.",
                isNew: true,
            },
        ])
    }

    const handleRegistrationSuccess = () => {
        setIsRegistered(true)
    }

    const handleVerifySuccess = () => {
        setIsVerified(true)
    }


    const handleSend = async (message: Message) => {
        const updatedMessages = [...messages, message];
    
        setMessages(updatedMessages);
        setLoading(true);
    
    
        try {
            // Here's the new part: sending the message to your backend
            // TO-DO: remove the fixed varialbe for model_id
            let tempModelId = "1136c0c0-61c1-4eeb-a4ce-1a72f8e0ff11";
            let address = "0x123";

            console.log("${process.env.NEXT_PUBLIC_API_URL} is: ", process.env.NEXT_PUBLIC_API_URL)
            console.log("${process.env.FLOCK_BOT_API_KEY} is: ", process.env.FLOCK_BOT_API_KEY)

            console.log("accountAddress", accountAddress)
            console.log(" message.content",  message.content)


            const response = await fetch(`${TEMP_PUBLIC_API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model_id: tempModelId,
                    user_address: address,
                    message: message.content, // Assuming the message object has a content property with the text
                }),
            });
    
            console.log("!!!", response);
            console.log("in handleSend, modelId is :", modelId);
            console.log("in handleSend, message content is :", message.content);


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Received message:", data.message);
    
            // Update the UI to include the response from the assistant
            setMessages((messages) => [
                ...messages,
                {
                    role: "assistant",
                    content: data.message, // Assuming the backend responds with the message in this format
                    isNew: true,
                },
            ]);
            
            setLoading(false);
        } catch (error) {
            if (error instanceof Response) {
                const errorData = await error.json();
                console.error("Error data:", errorData);
            }
            console.error("An error occurred while sending the message:", error);
            setLoading(false);
        }
    };


    const fetchChatHistory = async () => {
        if (!accountAddress || !modelId) {
            console.error("User address and model ID are required")
            return
        }

        try {
            const response = await fetch(
                `${TEMP_PUBLIC_API_URL}/api/getAllChatHistory?user_address=${accountAddress}&model_id=${modelId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const history = await response.json()
            setMessages(history)
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error)
        }
    }

    const fetchModelId = async () => {
        const user_address = accountAddress
        const bot_name = botName
        const material = "x"

        try {
            const response = await fetch(`${TEMP_PUBLIC_API_URL}/api/createBot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_address,
                    bot_name,
                    material,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setModelId(data.model_id)
            
            console.log("now the data is,    ", data.model_id);


        } catch (error) {
            console.error("There was a problem with the fetch operation:", error)
        }
    }
    

    useEffect(() => {
            const checkIsRegistered = async () => {
                // if (accountInfo) {
                    try {
                        const response = await axios.post(
                            `${TEMP_PUBLIC_API_URL}/api/isRegistered`,
                            {
                                model_id: "your_model_id", // Adjust with actual logic to obtain the model_id
                                user_address: "user_address",
                            }
                        )
                        setIsRegistered(response.data.verified)
                    } catch (error) {
                        console.error("Error checking registration status:", error)
                        setIsRegistered(false) // Assuming default to not registered in case of error
                    }
                // }
            }
    
            checkIsRegistered()
        }, [])

    useEffect(() => {
        console.log("botName:", botName)

        if (botName) {
            fetchModelId()
        }
    }, [botName])

    useEffect(() => {
        if (modelId) {
            fetchChatHistory()
        }
    }, [modelId])

    useEffect(() => {
        if (!isMounted.current) {
            //   fetchChatSessions();
            isMounted.current = true
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, loading])



    return (
        <dialog id="chatModal" className="modal">
            <div className="card w-[750px]">
                <div className="flex flex-col" style={{ overflow: "hidden" }}>
                    <div className="p-4 bg-slate-300 rounded-tl-lg rounded-tr-lg">
                        <div className="ml-4 flex">
                            <div className="w-1/2">
                                <label
                                    htmlFor="chatSessionSelect"
                                    className="block ml-1 text-sm font-bold text-gray-700"
                                >
                                    <form method="dialog">
                                        <button className="btn">Close</button>
                                    </form>


                                    <div>


                {isRegistered === false && (
                    <div>
                        <button
                            className="btn"
                            onClick={() => {
                                const modal = document.getElementById("my_modal_5")
                                if (modal instanceof HTMLDialogElement) {
                                    modal.showModal()
                                }
                            }}
                        >
                            create your identity
                        </button>
                        <Register onRegistrationSuccess={handleRegistrationSuccess} />
                    </div>
                )}

                
                {isRegistered && (
                    <div>
                        <button
                            className="btn"
                            onClick={() => {
                                const modal = document.getElementById("my_modal_4")
                                if (modal instanceof HTMLDialogElement) {
                                    modal.showModal()
                                }
                            }}
                        >
                            verify your identity
                        </button>
                        <Verify onVerifySuccess={handleVerifySuccess} />
                    </div>
                )}

{!isVerified && (
                <p className="fixed text-red-500 bg-opacity-75">
                    Please verify your identity before chatting with any bot!
                </p>
            )}

                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto sm:px-2 pb-4 sm:pb-10 bg-slate-600 min-h-[500px]">
                        <div className="static mx-auto mt-4 sm:mt-4 ">
                            <div className="mt-6">
                                <Chat messages={messages} loading={loading} />
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            <ChatInput onSend={handleSend} onFocus={() => {}} onBlur={() => {}} />
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}
