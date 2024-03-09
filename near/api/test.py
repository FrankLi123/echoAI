import os
import near_api

contract_id = "echoai.prelaunch.testnet"
signer_id = contract_id
signer_key = os.getenv("ECHOAI_PRIVATE_KEY", "")
near_provider = near_api.providers.JsonProvider("https://rpc.testnet.near.org")
key_pair = near_api.signer.KeyPair(signer_key)
signer = near_api.signer.Signer(signer_id, key_pair)
account = near_api.account.Account(near_provider, signer)
# NFT mint, for data use anything such as uuid or hash
# args = {"receiver_id": "waver.testnet", "data": "testing"}
# out = account.function_call(contract_id, "nft_mint", args)
# url = "https://testnet.nearblocks.io/txns/" + out['transaction']['hash']
# print(url)
out = account.view_function(contract_id, "nft_tokens", {})
print(out['result'])
