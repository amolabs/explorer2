import {combineReducers} from "redux"
import blockchain from './blockchain'
import blocks from "./blocks"
import {connectRouter} from 'connected-react-router'
import {History} from 'history'
import {shallowEqual, useSelector} from "react-redux"
import {useEffect, useState} from "react"

const rootReducer = (history: History<History.LocationState>) => combineReducers({
  blockchain,
  blocks,
  router: connectRouter(history)
})

export default rootReducer

export type RootState = ReturnType<ReturnType<typeof rootReducer>>

type UpdateState = {
  updated: boolean,
  chainId: string,
  height: number
}

type FixedHeightState = {
  updated: boolean,
  height: number,
  chainId: string
}

export const useUpdateState = () => {
  return useSelector<RootState, UpdateState>(state => ({
    updated: state.blockchain.updated,
    chainId: state.blockchain.chainId,
    height: state.blockchain.height
  }), shallowEqual)
}

export const useFixedHeight = () => {
  const {updated, height, chainId} = useSelector<RootState, FixedHeightState>(state => ({
    updated: state.blockchain.updated,
    height: state.blockchain.height,
    chainId: state.blockchain.chainId
  }))
  const [fixedHeight, setFixedHeight] = useState(-1)

  useEffect(() => {
    if (updated && fixedHeight === -1) {
      setFixedHeight(height)
    }
  }, [fixedHeight, updated, height])

  return {chainId, fixedHeight}
}
