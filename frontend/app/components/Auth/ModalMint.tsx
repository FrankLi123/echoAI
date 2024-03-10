import { AccountInfo } from "@/app/page"
import { NFTData, checkNft } from "@/utils/near"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface Props {
    accountInfo: AccountInfo | null
    minting: boolean
    handleMint: (name: string) => Promise<void>
}

const MintModal: React.FC<Props> = ({ accountInfo, minting, handleMint }) => {
    const [botName, setBotName] = useState<string>("")
    return (
        <dialog id="mintModal" className="modal">
            <div className="modal-box w-[500px] max-w-5xl gap-4">
                <h3 className="font-bold text-lg">Mint your bot</h3>
                <label className="input input-bordered flex items-center gap-2 mt-8 mb-8">
                    Bot Name
                    <input
                        type="text"
                        onChange={(e) => {
                            setBotName(e.target.value)
                        }}
                        className="grow"
                        placeholder=""
                    />
                </label>
                <button
                    onClick={async () => {
                        if (!accountInfo){
                            
                        }
                        await handleMint(botName)
                    }}
                    className="btn btn-secondary"
                >
                    Mint
                </button>
                <p className="py-2"></p>
                <div className="modal-action">
                    <form method="dialog">
                        <p></p>
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default MintModal
