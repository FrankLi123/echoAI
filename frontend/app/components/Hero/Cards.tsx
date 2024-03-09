import { AccountInfo } from "@/app/page"
import { NFTData, checkNft } from "@/utils/near"
import React, { FC, useEffect, useState } from "react"
import { useToast } from "../PlugIn/ToastProvider"
import { ChatUi } from "../Chat/ChatUi"
interface CardsProps {
    accountInfo: AccountInfo | null
}
const Cards: FC<CardsProps> = ({ accountInfo }) => {
    const [nftData, setNftData] = useState<NFTData[] | []>([])
    const [accountAddress, setAccountAddress] = useState<string>("")
    const [botName, setBotName] = useState<string>("")
    const { showToast } = useToast()
    const checkIdentity = async () => {
        if (accountInfo?.accountId) {
            const result = await checkNft(accountInfo?.accountId)
            if (result.length > 0) {
                console.log(result[result.length - 1])
                setNftData(result)
            }
        }
    }

    const convertTimestamp = (timestamp: number) => {
        const date: Date = new Date(timestamp * 1000)
        const localTime: string = date.toLocaleString()
        return localTime
    }

    useEffect(() => {
        checkIdentity()
    }, [accountInfo])

    return (
        <div className="grid grid-cols-3 gap-4 px-8 py-8">
            {nftData.length > 0 &&
                nftData.map((nftData) => (
                    <div className="card w-96 glass" key={nftData.token_id}>
                        <figure>
                            <img src={nftData!.metadata!.media!} alt="Echo AI" />
                        </figure>
                        <div className="card-body">
                            <div className="card bordered">
                                <div className="card-body text-white">
                                    <h2 className="card-title">
                                        {nftData.metadata.extra.split("$#$")[0]}
                                    </h2>
                                    <p>token id: {nftData.token_id}</p>
                                    <p>
                                        minted at: {convertTimestamp(nftData.metadata.issued_at)}
                                    </p>
                                    <div className="card-actions justify-center mt-4">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                const modal = document.getElementById("chatModal")
                                                if (modal instanceof HTMLDialogElement) {
                                                    modal.showModal()
                                                }
                                                return
                                            }}
                                        >
                                            Chat Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            <div className="card w-96 glass">
                {/* <figure>
                    <img src={nftData!.metadata!.media!} alt="Echo AI" />
                </figure> */}
                <div className="card-body">
                    <div className="card-body justify-center">
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                if (!accountInfo) {
                                    showToast(
                                        "Please connect your wallet to mint your identity",
                                        "info"
                                    )
                                } else {
                                    const modal = document.getElementById("mintModal")
                                    if (modal instanceof HTMLDialogElement) {
                                        modal.showModal()
                                    }
                                    return
                                }
                            }}
                        >
                            Mint Your Chat Bot
                        </button>
                    </div>
                </div>
            </div>
            <ChatUi accountAddress={accountAddress} botName={botName} />
        </div>
    )
}

export default Cards
