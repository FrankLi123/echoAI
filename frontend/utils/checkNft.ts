import { connect, keyStores, WalletConnection } from "near-api-js"

async function initNear() {
    const near = await connect({
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
    })

    // const walletConnection = new WalletConnection(near, null)
    // return { near, walletConnection }
}

async function getNFTs(accountId: string) {
    if (!accountId) {
        throw new Error("accountId is required")
    }
    // const { near, walletConnection } = await initNear()
    // const account = await near.account(accountId)

    // const nftContractId = "echoai.prelaunch.testnet"

    // const nfts = await account.viewFunction(nftContractId, "nft_tokens_for_owner", {
    //     account_id: accountId,
    // })

    // return nfts
}
