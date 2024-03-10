"use client"
import Link from "next/link"
import NearWallet from "../Auth/NearWallet"
import Image from "next/image"
import { AccountInfo } from "@/app/page"
import { useToast } from "../PlugIn/ToastProvider"
import { useEffect, useState } from "react"
import { checkIfIdentityMinted, mintNFT } from "@/utils/near"
import { WalletSelector } from "@near-wallet-selector/core"
import IdentityModal from "../Auth/ModalVerify"
import MintModal from "../Auth/ModalMint"

interface NavBarProps {
    accountInfo: AccountInfo | null
    setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo | null>>
    walletSelector: WalletSelector | null
    setWalletSelector: React.Dispatch<React.SetStateAction<WalletSelector | null>>
    identityMinted: boolean
    setIdentityMinted: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBar: React.FC<NavBarProps> = ({
    accountInfo,
    setAccountInfo,
    walletSelector,
    setWalletSelector,
    identityMinted,
    setIdentityMinted,
}) => {
    const [minting, setMinting] = useState<boolean>(false)
    const { showToast } = useToast()

    const handleMint = async (data: string) => {
        setMinting(true)
        if (accountInfo?.accountId && walletSelector) {
            
            console.log("walletSelector", walletSelector);
            console.log("accountInfo?.accountId", accountInfo?.accountId);
            console.log("data", data);
            
            const result = await mintNFT(walletSelector, accountInfo?.accountId, data)
            console.log(result)
            if (result) {
                showToast("Identity minted successfully", "success")
                // checkIfIdentity(accountInfo?.accountId)
            }
        } else {
            showToast("Please connect your wallet to mint your identity", "info")
        }
        setMinting(false)
    }

    const checkIfIdentity = async (accountId: string) => {
        const result = await checkIfIdentityMinted(accountId)
        setIdentityMinted(result)
    }

    useEffect(() => {
        if (accountInfo?.accountId && walletSelector) {
            checkIfIdentity(accountInfo?.accountId)
        }
    }, [accountInfo])

    return (
        <div className="navbar ">
            <div className="flex-1">
                <a className="btn btn-ghost">
                    <Image
                        className="rounded-full"
                        src="/logo.jpg"
                        width={30}
                        height={30}
                        alt="echologo"
                    />
                    <div className="flex flex-col">
                        <div className="text-2xl text-left">Echo</div>
                    </div>
                    <div className="text-sm text-left"> - Your personal digital identity</div>
                </a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <button
                            disabled={minting}
                            onClick={() => {
                                const modal = document.getElementById("mintModal")
                                if (modal instanceof HTMLDialogElement) {
                                    modal.showModal()
                                }
                                return
                            }}
                        >
                            {!minting ? (
                                "Mint identity"
                            ) : (
                                <>
                                    <div>minting..</div>
                                    <span className="loading loading-spinner text-secondary"></span>
                                </>
                            )}
                        </button>
                    </li>
                    <MintModal
                        accountInfo={accountInfo}
                        minting={minting}
                        handleMint={handleMint}
                    />
                    <IdentityModal accountInfo={accountInfo} minting={minting} />
                    <li>
                        <NearWallet
                            accountInfo={accountInfo}
                            setAccountInfo={setAccountInfo}
                            walletSelector={walletSelector}
                            setWalletSelector={setWalletSelector}
                        />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NavBar
