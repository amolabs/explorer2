import Axios, {AxiosResponse} from "axios"
import {BlockState} from "./reducer/blocks"
import {TransactionSchema} from "./reducer/blockchain"

const defaultURL = "http://explorer.amolabs.io/api"

const client = Axios.create({
  baseURL: defaultURL
})

type Result<T> = Promise<AxiosResponse<T>>

const fetchBlocks = (chainId: string, blockHeight: number, size: number = 20): Result<BlockState[]> => {
  return client
    .get(`/chain/${chainId}/blocks?from=${blockHeight}&num=${size}&order=desc`)
}

export type BlocksStat = {
  chain_id: string,
  last_height: number,
  num_blocks: number,
  num_txs: number,
  avg_num_txs: number,
  avg_blk_tx_bytes: number,
  avg_interval: number
}

const fetchBlocksStats = (chainId: string, blocks: number = 100): Result<BlocksStat> => {
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

export default {
  fetchBlocks,
  fetchBlocksStats,
  fetchTransactions,
  fetchBlock,
  fetchBlockTransaction,
  fetchTransaction
}
