import { WalletSelector } from "@near-wallet-selector/core"
import { connect, keyStores, WalletConnection, Near, Account } from "near-api-js"
import { v4 as uuidv4 } from "uuid"

interface Metadata {
    copies: string | null
    description: string
    expires_at: null | null
    extra: string
    issued_at: number
    media: string | null
    media_hash: string | null
    reference: string
    reference_hash: string | null
    starts_at: string | null
    title: string
    updated_at: string | null
}

export interface NFTData {
    token_id: string
    owner_id: string
    metadata: Metadata
}

const contractId = "echo.prelaunch.testnet"

export async function initNear(): Promise<{ near: Near; walletConnection: WalletConnection }> {
    const near = await connect({
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
    })

    const walletConnection = new WalletConnection(near, "echoai-app")
    return { near, walletConnection }
}

export async function mintNFT(walletSelector: WalletSelector, receiverId: string, data: string, link: string) {
    if (!walletSelector) {
        console.log("Wallet Selector is not initialized.")
        return
    }

    if (!walletSelector.isSignedIn()) {
        console.log("User is not signed in.")
        return
    }

    const wallet = await walletSelector.wallet()
    let hashed_data = data + "$#$" + uuidv4() + "$#$" +  link;
    try {
        const functionCallDetails = {
            methodName: "nft_mint",
            args: { receiver_id: receiverId, data: hashed_data },
            gas: "30000000000000",
            deposit: "10000000000000000000000",
        }
        const result = await wallet.signAndSendTransaction({
            receiverId: contractId,
            actions: [
                {
                    type: "FunctionCall",
                    params: functionCallDetails,
                },
            ],
        })
        return result
    } catch (error) {
        console.error("Error minting NFT:", error)
    }
}

export async function checkIfIdentityMinted(accountId: string): Promise<boolean> {
    if (!accountId) {
        throw new Error("accountId is required")
    }
    const { near } = await initNear()
    const account: Account = await near.account(accountId)

    const nftContractId = contractId

    const number: number = await account.viewFunction({
        contractId: nftContractId,
        methodName: "nft_supply_for_owner",
        args: { account_id: accountId },
    })

    return number > 0
}

export async function checkNft(accountId: string): Promise<NFTData[]> {
    if (!accountId) {
        throw new Error("accountId is required")
    }
    const { near } = await initNear()
    const account: Account = await near.account(accountId)

    const nftContractId = contractId

    const nfts: NFTData[] = await account.viewFunction({
        contractId: nftContractId,
        methodName: "nft_tokens_for_owner",
        args: { account_id: accountId },
    })

    return nfts
}
