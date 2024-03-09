"use client"

import { useState } from "react"
import NavBar from "./components/Hero/NavBar"
import { ToastProvider } from "./components/PlugIn/ToastProvider"
import Cards from "./components/Hero/Cards"

export interface AccountInfo {
    accountId: string
    publicKey: string
}

export default function Home() {
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)

    return (
        <ToastProvider>
            <div className="w-full h-full bg-base-100">
                <NavBar setAccountInfo={setAccountInfo} accountInfo={accountInfo} />
                <Cards />
                {/* <ChatUi userName={UserName} /> */}
            </div>
        </ToastProvider>
    )
}
