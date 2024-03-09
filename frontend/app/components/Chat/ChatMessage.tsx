import { Message } from "@/types"
import { FC } from "react"
import TypingAnimation from "./TypingAnimation"

interface Props {
    message: Message
}

export const ChatMessage: FC<Props> = ({ message }) => {
    return (
        <div
            className={`flex flex-col ${
                message.role === "assistant" ? "items-start " : "items-end"
            } rounded-md px-2 py-1 w-auto`}
        >
            <div
                className={`flex items-center ${
                    message.role === "assistant"
                        ? "bg-metissa-deep-blue text-gray-700 font-semibold bg-blue-300"
                        : "bg-metissa-purple text-gray-700 font-semibold bg-slate-300"
                } rounded-2xl px-3 py-2 whitespace-pre-wrap break-all max-w-[80%]`}
            >
                {message.role == "assistant" && message.isNew == true ? (
                    <TypingAnimation text={message.content} typingSpeed={30} />
                ) : (
                    message.content
                )}
            </div>
        </div>
    )
}
