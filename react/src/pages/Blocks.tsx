import React, {useEffect, useState} from 'react'
import {BlockState} from "../reducer/blocks"
import {useSelector} from "react-redux"
import {RootState, useUpdateState} from "../reducer"
import {Grid, Snackbar} from "@material-ui/core"
import InfinityTable, {useScrollUpdate} from "../component/InfinityTable"
import ExplorerAPI, {BlocksStat} from '../ExplorerAPI'
import MuiAlert from "@material-ui/lab/Alert"
import {Link} from "react-router-dom"
import StatCard from "../component/StatCard"
import {History, Timeline, TrendingUp, ViewModule} from "@material-ui/icons"
import SizeTitle, {LastOptions} from "../component/SizeTitle"

const columns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    flexGrow: 1,
    columnData: {
      format: (height: number) => {
        return (
          <Link to={`/amo-cherryblossom-01/inspect/block/${height}`}>
            {height}
          </Link>
        )
      }
    }
  },
  {
    key: 'time',
    label: 'Time',
    width: 100,
    flexGrow: 5
  },
  {
    key: 'proposer',
    label: 'Proposer',
    width: 100,
    flexGrow: 10
  },
  {
    key: 'num_txs',
    label: "# of Txs",
    width: 100,
    flexGrow: 1
  }
]

type BlocksStatProps = {
  setRef: (instance?: HTMLDivElement) => void
}

const BlocksStatView = (props: BlocksStatProps) => {
  const [blocksStat, setBlocksStat] = useState<BlocksStat>({
    chain_id: 'amo-cherrryblossom-01',
    last_height: 1,
    num_blocks: 1,
    num_txs: 0,
    avg_num_txs: 0,
    avg_blk_tx_bytes: 0,
    avg_interval: 0
  })
  const {chainId} = useUpdateState()

  const onSizeChange = (lastBlocks: number) => {
    ExplorerAPI
      .fetchBlocksStats(chainId, lastBlocks)
      .then(({data}) => {
        setBlocksStat(data)
      })
  }

  useEffect(() => {
    onSizeChange(100)
  }, [])

  return (
    <>
      <StatCard
        title={<SizeTitle target="Block" values={LastOptions} onSizeChange={onSizeChange}/>}
        size="large"
        setRef={props.setRef}
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={History}
            title="Average interval"
            suffix="s / blk"
            color="#FF6E4A"
          >
            {blocksStat.avg_interval.toFixed(2)}
          </StatCard>
          <StatCard
            icon={TrendingUp}
            title="Average incentive"
            suffix="AMO / blk"
            color="#9179F2"
          >
            -
          </StatCard>
          <StatCard
            icon={Timeline}
            title="Average # of txs"
            suffix="txs / blk"
            color="#62D96B"
          >
            {blocksStat.avg_num_txs.toFixed(2)}
          </StatCard>
          <StatCard
            icon={ViewModule}
            title="Average tx bytes"
            suffix="B / blk"
          >
            {blocksStat.avg_blk_tx_bytes}
          </StatCard>
        </Grid>
      </StatCard>
    </>
  )
}

const Blocks = () => {
  const {chainId, updated} = useUpdateState()
  const blockHeight = useSelector<RootState, number>(state => state.blockchain.height)

  const [maxHeight, setMaxHeight] = useState(1)
  const [ref, setRef] = useState<HTMLDivElement | undefined>(undefined)

  const [blocks, setBlocks, loading, setLoading, onScroll] = useScrollUpdate<BlockState>(async (size) => {
    const nextHeight = maxHeight - size

    if (nextHeight <= 0) {
      setLoading('done')
      return []
    }

    const {data} = await ExplorerAPI.fetchBlocks(chainId, maxHeight - size)
    return data
  }, 200 + (ref ? ref.clientHeight : 0))

  useEffect(() => {
    if (updated) {
      setMaxHeight(blockHeight)
      ExplorerAPI
        .fetchBlocks(chainId, blockHeight)
        .then(({data}) => {
          setBlocks(data)
          window.scrollTo({
            top: 0
          })
        })
    }
  }, [updated])

  return (
    <>
      <BlocksStatView
        setRef={setRef}
      />
      <InfinityTable<BlockState>
        onScroll={onScroll}
        columns={columns}
        rowKey={'hash'}
        data={blocks}
      />
      <Snackbar
        open={loading === 'fetch'}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <MuiAlert elevation={6} variant="filled" severity="info">
          Loading...
        </MuiAlert>
      </Snackbar>
    </>
  )
}

export default Blocks