import {combineReducers} from "redux"
import blockchain from './blockchain'
import blocks from "./blocks"
import {connectRouter} from 'connected-react-router'
import {History} from 'history'

const rootReducer = (history: History<History.LocationState>) => combineReducers({
  blockchain,
  blocks,
  router: connectRouter(history)
})

export default rootReducer

export type RootState = ReturnType<ReturnType<typeof rootReducer>>

