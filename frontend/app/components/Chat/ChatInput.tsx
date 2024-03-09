import { Message } from "@/types"
import { IconArrowUp } from "@tabler/icons-react"
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react"

interface Props {
    onSend: (message: Message) => void
    onFocus: () => void
    onBlur: () => void
}

export const ChatInput: FC<Props> = ({ onSend, onFocus, onBlur }) => {
    const [content, setContent] = useState<string>()

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length > 8988) {
            alert("Message limit is 8988 characters")
            return
        }

        setContent(value)
    }

    const handleSend = () => {
        if (!content) {
            alert("Please enter a message")
            return
        }
        onSend({ role: "user", content })
        setContent("")
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height = "inherit"
            textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`
        }
    }, [content])

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                className="min-h-[44px] max-h-[44px] rounded-bl-lg rounded-br-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200 bg-slate-300 text-black"
                style={{ resize: "none", overflowY: "auto" }}
                placeholder="Type a message..."
                value={content}
                rows={1}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
            />

            <button onClick={() => handleSend()}>
                <IconArrowUp className="absolute right-2 bottom-3 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-metissa-purple text- bg-black hover:opacity-80" />
            </button>
        </div>
    )
}
