import Axios, {AxiosResponse} from "axios"
import {BlockState} from "./reducer/blocks"
import {TransactionSchema} from "./reducer/blockchain"

const defaultURL = "http://52.231.99.106:3000"

const client = Axios.create({
  baseURL: defaultURL
})

type Result<T> = Promise<AxiosResponse<T>>

const fetchBlocks = (chainId: string, blockHeight: number, size: number = 20): Result<BlockState[]> => {
  return client
    .get(`/chain/${chainId}/blocks?anchor=${blockHeight}&num=${size}&order=desc`)
}

const fetchBlocksStats = (chainId: string, blocks: number = 100): Result<BlockStat> => {
  return client
    .get(`/chain/${chainId}/blocks?stat&num_blks=${blocks}`)
}

const fetchTransactions = (chainId: string, top: number, from: number, size: number = 20): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/txs?top=${top}&from=${from}&num=${size}`)
}

const fetchBlock = (chainId: string, height: number): Result<BlockState> => {
  return client
    .get(`/chain/${chainId}/blocks/${height}`)
}

const fetchBlockTransaction = (chainId: string, height: number, from: number, size: number = 20): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/blocks/${height}/txs?from=${from}&num=${size}`)
}

const fetchTransaction = (chainId: string, hash: string): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/txs/${hash}`)
}

export type ValidatorStat = {
  avg_blk_incentive: string,
  avg_eff_stake: number,
  total_eff_stakes: number
  num_validators: number
}

const fetchValidatorStat = (chainId: string): Result<ValidatorStat> => {
  return client
    .get(`/chain/${chainId}/validators?stat`)
}

export type AccountSchema = {
  chain_id: string,
  address: string,
  balance: string,
  stake: string,
  val_addr: string,
  delegate: string,
  del_addr?: string,
  val_pubkey: string,
  val_power: string
}

export type ValidatorAccount = {
  address: string,
  eff_stake: string,
  owner: string,
  power: string,
  pubkey: string,
  stake: string
}

const fetchValidators = (chainId: string, from: number, size: number = 20): Result<ValidatorAccount[]> => {
  return client
    .get(`/chain/${chainId}/validators?from=${from}&num=${size}`)
}

export type DelegateItem = {
  address: string,
  delegate: string
}

const fetchDelegators = (chainId: string, address: string, from: number, size: number = 20): Result<DelegateItem[]> => {
  return client
    .get(`/chain/${chainId}/validators/${address}/delegators`)
}

const fetchAccount = (chainId: string, address: string): Result<AccountSchema> => {
  return client
    .get(`/chain/${chainId}/accounts/${address}`)
}

const fetchAccountTransactions = (chainId: string, address: string, top: number, from: number, size: number = 20): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/accounts/${address}/txs?top=${top}&from=${from}&num=${size}`)
}

type Delegate = {
  address: string,
  amount: string
}

const fetchValidatorAccount = (chainId: string, address: string): Result<ValidatorAccount> => {
  return client
    .get(`/chain/${chainId}/validators/${address}`)
}

export type BlockStat = {
  chain_id: string,
  last_height: number,
  num_txs: number,
  avg_num_txs: number,
  avg_blk_tx_bytes: number,
  avg_interval: number
}

export type TxStat = {
  chain_id: string,
  tx_height: number,
  num_txs: number,
  num_txs_valid: number,
  num_txs_invalid: number
  avg_fee: number,
  avg_tx_bytes: number,
  avg_binding_lag: number,
  max_binding_lag: number
}

const fetchTxStat = (chainId: string, txs: number = 100): Result<TxStat> => {
  return client
    .get(`/chain/${chainId}/txs?stat&num_txs=${txs}`)
}

export type AssetStat = {
  chain_id: string,
  active_coins: string,
  stakes: string,
  delegates: string
}

export type BlockchainStat = {
  block_stat: BlockStat
  tx_stat: TxStat
  asset_stat: AssetStat
  height: number,
  time: string,
  tx_height: number,
  tx_index: number
} & BlockStat
  & Pick<TxStat, 'num_txs_valid' | 'num_txs_invalid' | 'avg_binding_lag' | 'max_binding_lag'>
  & AssetStat

const fetchBlockchain = (chainId: string, blocks: number = 1000, txs: number = 1000): Result<BlockchainStat> => {
  return client
    .get(`/chain/${chainId}?num_blks=${blocks}&num_txs=${txs}`)
}

export type IncentiveStat = {
  avgIncentive: number,
  avgReward: number,
  avgTxFee: number,
  estInterest: number
}

const fetchIncentiveStat = (chainID: string) => {

}

export default {
  fetchBlocks,
  fetchBlocksStats,
  fetchTransactions,
  fetchBlock,
  fetchBlockTransaction,
  fetchTransaction,
  fetchValidatorStat,
  fetchValidators,
  fetchAccount,
  fetchAccountTransactions,
  fetchValidatorAccount,
  fetchBlockchain,
  fetchTxStat,
  fetchDelegators,

}
