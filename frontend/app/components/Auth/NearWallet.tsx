"use client"

import { setupWalletSelector } from "@near-wallet-selector/core"
import { setupModal } from "@near-wallet-selector/modal-ui"
import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet"
import { setupSender } from "@near-wallet-selector/sender"
import { setupHereWallet } from "@near-wallet-selector/here-wallet"
import { setupMathWallet } from "@near-wallet-selector/math-wallet"
import { setupNightly } from "@near-wallet-selector/nightly"
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet"
import { setupNarwallets } from "@near-wallet-selector/narwallets"
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet"
import { setupLedger } from "@near-wallet-selector/ledger"
import { setupNearFi } from "@near-wallet-selector/nearfi"
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet"
import { setupNeth } from "@near-wallet-selector/neth"
import { setupXDEFI } from "@near-wallet-selector/xdefi"
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet"
import { useEffect, useState } from "react"

const NearWallet: React.FC = () => {
    const [walletSelector, setWalletSelector] = useState<any>(null)
    const [accountInfo, setAccountInfo] = useState({ isConnected: false, accountId: '' });
    const [modal, setModal] = useState<any>(null)

    useEffect(() => {
        const initSelector = async () => {
            const walletSelector = await setupWalletSelector({
                network: "testnet",
                modules: [
                    setupBitgetWallet(),
                    setupMyNearWallet(),
                    setupSender(),
                    setupHereWallet(),
                    setupMathWallet(),
                    setupNightly(),
                    setupMeteorWallet(),
                    setupNarwallets(),
                    setupWelldoneWallet(),
                    setupLedger(),
                    setupNearFi(),
                    setupCoin98Wallet(),
                    setupNeth(),
                    setupXDEFI(),
                    setupNearMobileWallet(),
                ],
            })

            const walletModal = setupModal(walletSelector, {
                contractId: "guest-book.testnet",
            })

            setModal(walletModal)
            setWalletSelector(walletSelector)

            // Automatically fetch the account ID if the user is already signed in
            // if (walletSelector.isSignedIn()) {
            //     const wallet = await walletSelector.wallet()
            //     setAccountInfo({
            //         isConnected: true,
            //         // accountId: wallet.getAccountId(),
            //     })
            // }
        }

        initSelector()
    }, [])

    const showWalletModal = () => {
        if (modal) {
            modal.show()
            console.log(modal)
        }
    }
    return <button onClick={showWalletModal}>{true ? "connected" : "Connect Wallet"}</button>
}

export default NearWallet
