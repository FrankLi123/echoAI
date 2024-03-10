"use client"

import { useState } from "react"
import NavBar from "./components/Hero/NavBar"
import { ToastProvider } from "./components/PlugIn/ToastProvider"
import Main from "./components/Hero/Main"
import { WalletSelector } from "@near-wallet-selector/core"

export interface AccountInfo {
    accountId: string
    publicKey: string
}

export default function Home() {
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
    const [walletSelector, setWalletSelector] = useState<WalletSelector | null>(null)
    const [identityMinted, setIdentityMinted] = useState<boolean>(false)

    return (
        <ToastProvider>
            <div className="w-full h-full bg-base-100">
                <NavBar
                    setAccountInfo={setAccountInfo}
                    accountInfo={accountInfo}
                    walletSelector={walletSelector}
                    setWalletSelector={setWalletSelector}
                    identityMinted={identityMinted}
                    setIdentityMinted={setIdentityMinted}
                />
                <Main accountInfo={accountInfo}/>
                {/* <ChatUi userName={UserName} /> */}
            </div>
        </ToastProvider>
    )
}
