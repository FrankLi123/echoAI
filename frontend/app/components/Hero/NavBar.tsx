"use client"
import Link from "next/link"
import NearWallet from "../Auth/NearWallet"
import Image from "next/image"
import { AccountInfo } from "@/app/page"
import { useToast } from "../PlugIn/ToastProvider"
import { useState } from "react"

interface NavBarProps {
    accountInfo: AccountInfo | null
    setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo | null>>
}

const NavBar: React.FC<NavBarProps> = ({ accountInfo, setAccountInfo }) => {
    const [minting, setMinting] = useState<boolean>(false)
    const { showToast } = useToast()
    const handleMint = async () => {
        if (accountInfo === null || accountInfo.accountId === "") {
            showToast("Please connect wallet to mint your identity!", "info")
        } else {
            setMinting(true)
            showToast("minting your identity, please wait...", "success")
            const res = await fetch(
                `https://gba-api.thefans.life/near/nft/mint?receiver=${accountInfo.accountId}&data=testing`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            const data = await res.json()
            showToast("Success! check transaction: " + data.response, "success")
            setMinting(false)
        }
    }
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
                            onClick={() => {
                                handleMint()
                            }}
                        >
                            {!minting ? (
                                "Mint your identity"
                            ) : (
                                <>
                                    <div>minting..</div>
                                    <span className="loading loading-spinner text-secondary"></span>
                                </>
                            )}
                        </button>
                    </li>
                    <li>
                        <NearWallet accountInfo={accountInfo} setAccountInfo={setAccountInfo} />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NavBar
