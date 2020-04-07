import React, {useEffect} from 'react'
import StatCard from "../component/StatCard"
import {
  AccountBalance,
  AccountBalanceWallet,
  History,
  Receipt,
  Timeline,
  ViewCarousel,
  ViewHeadline
} from "@material-ui/icons"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../reducer"
import {GraphState} from "../reducer/blockchain"
import LinearGraph from "../component/LinearGraph"
import CollapseTable from "../component/CollapseTable"
import {BlockState, UPDATE_BLOCKS} from "../reducer/blocks"
import moment from 'moment'

const columns = [
  {
    key: 'height'
  },
  {
    key: 'hash'
  },
  {
    key: 'num_txs',
    header: '# of TXs'
  },
  {
    key: 'proposer'
  },
  {
    key: 'time',
    format: (s: string) => {
      return moment(s).fromNow()
    }
  }
]

const RecentBlocks = () => {
  const height = useSelector<RootState, number>(state => state.blockchain.blockState.height)
  const {blocks, currentHeight} = useSelector<RootState, any>(state => ({
    blocks: state.blocks.blocks,
    currentHeight: state.blocks.currentHeight
  }))

  const dispatch = useDispatch()

  useEffect(() => {
    if (height !== currentHeight) {
      dispatch({
        type: UPDATE_BLOCKS
      })
    }
  }, [height, dispatch])

  return (
    <CollapseTable<BlockState>
      dataSource={blocks}
      columns={columns}
      rowKey='height'
    />
  )
}

const ValidatorStatsTitle = [
  'Eff. Stake Total',
  'On-line',
  'Off-line'
]

const CoinsStatsTitles = [
  'Coin total',
  'Stakes',
  'Delegated stakes'
]

const CoinStats = () => {
  const coinsStats = useSelector<RootState, GraphState[]>(state => state.blockchain.blockState.coinsStats)

  return (
    <div>
      {
        coinsStats.map((v, i) => (
          <LinearGraph
            key={i}
            title={CoinsStatsTitles[i]}
            value={`${v.stringRepresentation} (${v.percent.toFixed(2)}%)`}
            percent={v.percent}
          />
        ))
      }
    </div>
  )
}

const ValidatorStats = () => {
  const validatorStats = useSelector<RootState, GraphState[]>(state => state.blockchain.blockState.validatorStats)

  return (
    <div>
      {
        validatorStats.map((v, i) => (
          <LinearGraph
            key={i}
            title={ValidatorStatsTitle[i]}
            value={`${v.stringRepresentation} (${v.percent.toFixed(2)}%)`}
            percent={v.percent}
          />
        ))
      }
    </div>
  )
}

const Blockchain = () => {
  const blockState = useSelector<RootState, any>(state => state.blockchain.blockState)

  return (
    <>
      <StatCard
        icon={<ViewHeadline/>}
        title="Block height"
      >
        {blockState.height}
      </StatCard>
      <StatCard
        icon={<History/>}
        title="Average interval"
        suffix='s'
        color='#FF6E4A'
      >
        {blockState.avg_interval.toPrecision(3)}
      </StatCard>
      <StatCard
        icon={<Timeline/>}
        title="Number of Transaction"
        color='#62D96B'
      >
        {blockState.num_txs_valid}
      </StatCard>
      <StatCard
        icon={<Receipt/>}
        title="Transaction per Block"
        suffix='/blk'
        color='#FFC940'
      >
        {(blockState.num_txs / blockState.height).toPrecision(3)}
      </StatCard>
      <StatCard
        icon={<AccountBalance/>}
        title="Validators"
        size='medium'
        color='#634DBF'
      >
        <ValidatorStats/>
      </StatCard>
      <StatCard
        icon={<AccountBalanceWallet/>}
        title="Coins and Stakes"
        size='medium'
        color='#F55656'
      >
        <CoinStats/>
      </StatCard>
      <StatCard
        icon={<ViewCarousel/>}
        title="Last blocks"
        size='large'
      >
        <RecentBlocks/>
      </StatCard>
    </>
  )
}

export default Blockchain
