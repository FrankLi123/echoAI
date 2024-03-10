use std::collections::HashMap;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, PromiseOrValue, assert_self
};

use crate::internal::*;
pub use crate::metadata::*;
pub use crate::nft_core::*;
pub use crate::approval::*;
pub use crate::events::*;

mod internal;
mod approval; 
mod enumeration; 
mod metadata; 
mod nft_core; 
mod events;

/// This spec can be treated like a version of the standard.
pub const NFT_METADATA_SPEC: &str = "nft-1.0.0";
/// This is the name of the NFT standard we're using
pub const NFT_STANDARD_NAME: &str = "nep171";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    //keeps track of all the token IDs for a given account
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
    //keeps track of the token struct for a given token ID
    pub tokens_by_id: UnorderedMap<TokenId, Token>,
    //keeps track of the token metadata for a given token ID
    pub index: u64,
    pub token_metadata: LazyOption<TokenMetadata>,
    pub tokens_data: LookupMap<TokenId, String>,
    pub metadata: LazyOption<NFTContractMetadata>,
    pub royalties: HashMap<AccountId, u32>
}

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    TokensPerOwner,
    TokenPerOwnerInner { account_id_hash: CryptoHash },
    TokensById,
    NFTContractMetadata,
    TokenMetadata,
    TokensPerType,
    TokensPerTypeInner { token_type_hash: CryptoHash },
    Royalties,
    Data
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(metadata: NFTContractMetadata, token_metadata: TokenMetadata) -> Self {
        //create a variable of type Self with all the fields initialized. 
        let this = Self {
            //Storage keys are simply the prefixes used for the collections. This helps avoid data collision
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner.try_to_vec().unwrap()),
            tokens_by_id: UnorderedMap::new(StorageKey::TokensById.try_to_vec().unwrap()),
            token_metadata: LazyOption::new(
                StorageKey::TokenMetadata.try_to_vec().unwrap(),
                Some(&token_metadata),
            ),
            tokens_data: LookupMap::new(StorageKey::Data.try_to_vec().unwrap()),
            metadata: LazyOption::new(
                StorageKey::NFTContractMetadata.try_to_vec().unwrap(),
                Some(&metadata),
            ),
            royalties: HashMap::new(),
            index: 0,
        };
        this
    }

    fn get_index(&mut self) -> (TokenId, u64) {
        self.index += 1;
        (self.index.to_string(), self.index)
    }

    pub fn recovery( &mut self,
        sender_id: AccountId,
        receiver_id: AccountId,
        token_id: TokenId,
    ) {
        assert_self();
        self.internal_transfer(
            &sender_id,
            &receiver_id,
            &token_id,
            None,
            Option::None
        );
    }

    #[payable]
    pub fn nft_mint(
        &mut self,
        receiver_id: AccountId,
        data: String
    ) -> Vec<TokenId> {
        // assert_self();
        let mut tokens = Vec::new();
        let (token_id, token_index) = self.get_index();
        let token = Token {
            owner_id: receiver_id.clone(),
            approved_account_ids: Default::default(),
            next_approval_id: 0,
            index: token_index.clone()
        };
        assert!(
            self.tokens_by_id.insert(&token_id, &token).is_none(),
                "Token already exists"
        );
        self.internal_add_token_to_owner(&token.owner_id, &token_id);
        let nft_mint_log: EventLog = EventLog {
            standard: NFT_STANDARD_NAME.to_string(),
            version: NFT_METADATA_SPEC.to_string(),
            event: EventLogVariant::NftMint(vec![NftMintLog {
                owner_id: token.owner_id.to_string(),
                token_ids: vec![token_id.to_string()],
                memo: None,
            }]),
        };
        self.tokens_data.insert(&token_id, &data);
        env::log_str(&nft_mint_log.to_string());
        tokens.push(token_id);
        tokens
    }
}
