import ChatUi from "./components/Chat/ChatUi"

export default function Home() {
    const UserName = "me"
    return (
        <div className="w-full h-full bg-black">
            <ChatUi userName={UserName} />
        </div>
    )
}
