import { AccountInfo } from "@/app/page"
import { NFTData, checkNft } from "@/utils/near"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { NFTStorage, File } from 'nft.storage';

interface Props {
    accountInfo: AccountInfo | null
    minting: boolean
    handleMint: (name: string, link: string) => Promise<void>
}


const MintModal: React.FC<Props> = ({ accountInfo, minting, handleMint }) => {
    const [botName, setBotName] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    function setImagePreview(result: string | ArrayBuffer | null): any {
        throw new Error("Function not implemented.")
    }

    // const nftStorageToken = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    // console.log("!!!!!!!", process.env.NEXT_PUBLIC_API_URL);
    const nftStorageToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVBQWNlODk5YjgyZWZDREZjN0M1OGE5MEZlNTBmZEJlQTUxM2JkY2MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMDA2NDYzMzM4OCwibmFtZSI6ImhhY2thdGhvbiJ9.H70qFjsNLRKRodgOKVX42VqFf873Y5lJT9XDgZxcS6A";

    if (!nftStorageToken) {
        throw new Error("NEXT_PUBLIC_NFT_STORAGE_TOKEN is not defined in your environment variables.");
    }

    const client = new NFTStorage({ token: nftStorageToken });

    
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
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="grow"
                    />
                </label>
                
                <button
                    onClick={async () => {
                        if (!accountInfo || !botName || !imageFile) {
                            console.log("Required information is missing.");
                            return;
                        }
                        
                        //upload image
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
