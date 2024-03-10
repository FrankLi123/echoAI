import { AccountInfo } from "@/app/page"
import { NFTData, checkNft } from "@/utils/near"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface Props {
    accountInfo: AccountInfo | null
    minting: boolean
}

const IdentityModal: React.FC<Props> = ({ accountInfo, minting }) => {
    const [nftData, setNftData] = useState<NFTData | null>(null)

    const checkIdentity = async () => {
        if (accountInfo?.accountId) {
            const result = await checkNft(accountInfo?.accountId)
            if (result.length > 0) {
                console.log(result[result.length - 1])
                setNftData(result[0])
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
    }, [accountInfo, minting])

    return (
        <dialog id="indentityModal" className="modal">
            {nftData != null && (
                <div className="modal-box w-[300px] max-w-5xl">
                    <h3 className="font-bold text-lg">{nftData.metadata.title}</h3>
                    {nftData.metadata.media && (
                        <Image src={nftData.metadata.media} width={260} height={260} alt="" />
                    )}
                    <p className="py-2">token id: {nftData.token_id}</p>
                    <p className="py-2">
                        minted at: {convertTimestamp(nftData.metadata.issued_at)}
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <p></p>
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            )}
        </dialog>
    )
}

export default IdentityModal
