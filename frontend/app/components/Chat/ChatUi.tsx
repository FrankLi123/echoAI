"use client"
import { ChatInput } from "./ChatInput"
import { Message } from "@/types"
import { useEffect, useRef, useState } from "react"
import { Chat } from "./Chat"
import LoginPage from "../Auth/LoginPage"

interface ChatUiProps {
    accountAddress: string
    botName: string
}

export const ChatUi: React.FC<ChatUiProps> = ({ accountAddress, botName }) => {
    const [modelId, setModelId] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const isMounted = useRef<boolean>(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

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

    const handleSend = async (message: Message) => {
        const updatedMessages = [...messages, message]

        setMessages(updatedMessages)
        setLoading(true)

        try {
            //   const data = await response.json();
            // console.log(data.user_email)
            await delay(1000)
            setLoading(false)
            // console.log("Received message:", data.message)
            setMessages((messages) => [
                ...messages,
                {
                    role: "assistant",
                    content: "This is a response from the assistant.",
                    isNew: true,
                },
            ])
        } catch (error) {
            console.error("An error occurred while sending the message:", error)
        }
    }

    const fetchChatHistory = async () => {
        if (!accountAddress || !modelId) {
            console.error("User address and model ID are required")
            return
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/getAllChatHistory?user_address=${accountAddress}&model_id=${modelId}`,
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createBot`, {
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
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error)
        }
    }
    
    useEffect(() => {
        console.log("botName", botName)
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
