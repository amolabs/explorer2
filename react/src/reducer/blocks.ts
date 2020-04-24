import {Action} from "redux"
import {SET_NETWORK, SetNetwork} from "./blockchain"

export const initialBlock = {
  chain_id: "amo-cherryblossom-01",
  height: 1,
  time: "2020-03-31T05:00:00.000Z",
  hash: "68C0F91BA364AF540D6828A4CD84B1CFD6A6442976E87F2DDA99F09FDD860B3D",
  num_txs: 0,
  interval: 0,
  proposer: "AB293BF0BFBCD22AE8D5346C5D672B3696AAED05",
  tx_bytes: 0,
  num_txs_valid: 0,
  num_txs_invalid: 0,
  incentives: "[]",
  validator_updates: "[]"
}

const initialState: {
  currentHeight: number,
  blocks: BlockState[]
} = {
  currentHeight: 1,
  blocks: []
}

export type BlocksInitialState = typeof initialState

export type BlockState = typeof initialBlock

export const UPDATE_BLOCKS = 'UPDATE_BLOCKS'

export const NEW_BLOCKS = 'NEW_BLOCKS'

export const RESET_CURRENT_HEIGHT = 'RESET_CURRENT_HEIGHT'

export const newBlocksAction = (payload: {
  blocks: BlockState[],
  currentHeight: number
}) => ({
  type: NEW_BLOCKS,
  payload
})

interface NewRecentBlocks extends Action {
  type: typeof NEW_BLOCKS,
  payload: {
    blocks: BlockState[]
    currentHeight: number
  }
}

type actions =
  NewRecentBlocks |
  SetNetwork |
  Action<typeof UPDATE_BLOCKS> |
  Action<typeof RESET_CURRENT_HEIGHT>

export default (state: BlocksInitialState = initialState, action: actions) => {
  switch (action.type) {
    case SET_NETWORK:
      return {
        ...initialState
      }
    case NEW_BLOCKS:
      return {
        ...state,
        ...action.payload
      }
    case RESET_CURRENT_HEIGHT:
      return {
        ...state,
        currentHeight: 0
      }
    default:
      return state
  }
}
