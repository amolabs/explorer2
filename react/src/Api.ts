import Axios, {AxiosResponse} from "axios"
import {BlockState} from "./reducer/blocks"

const defaultURL = "http://explorer.amolabs.io/api"

const client = Axios.create({
  baseURL: defaultURL
})

type Result<T> = Promise<AxiosResponse<T>>

const FetchBlocks = (chainId: string, blockHeight: number, size: number = 20): Result<BlockState[]> => {
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

const FetchBlocksStats = (chainId: string, blocks: number = 100): Result<BlocksStat> => {
  return client
    .get(`/chain/${chainId}/blocks?stat&num_blks=${blocks}`)
}

export default {
  FetchBlocks,
  FetchBlocksStats
}
