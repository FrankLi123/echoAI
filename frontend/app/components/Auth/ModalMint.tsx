import { AccountInfo } from "@/app/page"
import { NFTData, checkNft } from "@/utils/near"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { NFTStorage, File } from 'nft.storage';

interface Props {
    accountInfo: AccountInfo | null
    minting: boolean
    handleMint: (name: string) => Promise<void>
}

const MintModal: React.FC<Props> = ({ accountInfo, minting, handleMint }) => {
    const [botName, setBotName] = useState<string>("");
    const [imageFile, setImageFile] = useState(null);

    function setImagePreview(result: string | ArrayBuffer | null): any {
        throw new Error("Function not implemented.")
    }

    const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN! });
    
    const handleImageUpload = async (file: BlobPart) => {
        // Upload the file to NFT.storage and return the URL or CID
        try {
            const cid = await client.storeBlob(new Blob([file]));
            // Construct the URL to the uploaded file. 
            // You can use this URL in your handleMint function or store it as part of your NFT's metadata.
            const imageUrl = `https://ipfs.io/ipfs/${cid}`;
            return imageUrl;
        } catch (error) {
            console.error('Error uploading file to NFT.storage:', error);
            throw error;
        }
    };


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
                <label className="input input-bordered flex items-center gap-2 mt-8 mb-8">
                Bot Image
                <input
                    type="file"
                    accept="image/*" // Accept images of any type
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                    
                            reader.onload = (loadEvent) => {
                                // Adding a check to ensure loadEvent.target is not null
                                if (loadEvent.target !== null) {
                                    const result = loadEvent.target.result;
                                    // Now you can safely use 'result'
                                    // For example, setting it to state for preview
                                    // setImagePreview(result as string);
                                }
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="grow"
                />
            </label>

                <button
                    onClick={async () => {
                        if (!accountInfo){
                            
                        }
                        const imageUrl = await handleImageUpload(imageFile);
                        await handleMint(botName, imageUrl)
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
