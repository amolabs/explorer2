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

export default {
  FetchBlocks,
}
