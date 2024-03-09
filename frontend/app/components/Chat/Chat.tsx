import { Message } from "@/types"
import { FC } from "react"

import { ChatLoader } from "./ChatLoader"
import { ChatMessage } from "./ChatMessage"

interface Props {
    messages: Message[]
    loading: boolean
}

export const Chat: FC<Props> = ({ messages, loading }) => {
    return (
        <>
            <div className="flex flex-col " style={{ overflowX: "hidden" }}>
                <div className="flex-grow flex flex-col justify-between rounded-lg px-2 sm:p-4 ">
                    <div>
                        {messages.map((message, index) => (
                            <div key={index} className="my-1 sm:my-1.5  ">
                                <ChatMessage message={message} />
                            </div>
                        ))}
                        {loading && (
                            <div className="my-1 sm:my-1.5">
                                <ChatLoader />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
