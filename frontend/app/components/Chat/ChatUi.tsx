"use client"
import { ChatInput } from "./ChatInput"
import { Message } from "@/types"
import { useEffect, useRef, useState } from "react"
import { ThreeDots } from "react-loader-spinner"
import { Chat } from "./Chat"
import LoginPage from "../Auth/LoginPage"

export default function ChatUi(props: { userName: string }) {
    const [chatSessionId, setChatSessionId] = useState<number | null>(null)
    const [chatSessions, setChatSessions] = useState<any[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [newChatLoading, setnewChatLoading] = useState<boolean>(false)
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
    const [deleteSuccess, setDeleSuccess] = useState<boolean>(false)
    const isMounted = useRef<boolean>(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isDropdownButtonVisible, setIsDropdownButtonVisible] = useState(true)
    const [model, setModel] = useState<string>("Default")
    const [explanation, setExplanation] = useState("")

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const createNewChatSession = async () => {
        setnewChatLoading(true)
        setMessages([])
        // setChatSessionId(data.chat_session_id);
        setnewChatLoading(false)

        // Set the default message from the assistant for the new chat session
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
        if (!chatSessionId) {
            return
        }
    }

    useEffect(() => {
        fetchChatHistory()
    }, [chatSessionId])

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
        <div className="w-full h-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-500">
            <div
                className="flex flex-col h-screen max-w-[100%] p-2 lg:p-24 shadow-lg"
                style={{ overflow: "hidden" }}
            >
                <LoginPage />
                {/* top bar*/}
                <div className="p-4 bg-slate-300 rounded-tl-lg rounded-tr-lg">
                    <div className="ml-4 flex">
                        <div className="w-1/2">
                            <label
                                htmlFor="chatSessionSelect"
                                className="block ml-1 text-sm font-bold text-gray-700"
                            >
                                Chat
                            </label>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        backgroundImage: "url('/bg.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="flex-1 overflow-auto sm:px-2 pb-4 sm:pb-10 bg-slate-600 "
                >
                    <div className="static mx-auto mt-4 sm:mt-4 ">
                        <div className="mt-6">
                            <Chat messages={messages} loading={loading} />
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <ChatInput
                            onSend={handleSend}
                            onFocus={() => setIsDropdownButtonVisible(false)}
                            onBlur={() => setIsDropdownButtonVisible(true)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}