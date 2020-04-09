import React, {useEffect, useState} from 'react'
import {BlockState} from "../reducer/blocks"
import {useSelector} from "react-redux"
import {RootState} from "../reducer"
import {BlockchainInitialState} from "../reducer/blockchain"
import {Grid, Snackbar} from "@material-ui/core"
import InfinityTable from "../component/InfinityTable"
import Api from '../Api'
import MuiAlert from "@material-ui/lab/Alert"

type Loading = 'ready' | 'fetch' | 'done'

function useScrollUpdate<T>(fetcher: (size: number) => Promise<T[]>, threshold: number = 200): [
  T[],
  (list: T[]) => void,
  boolean,
  (loading: Loading) => void,
  (params: { scrollTop: number }) => void
] {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState<Loading>('ready')

  const onScroll = (params: { scrollTop: number }) => {
    const height = document.documentElement.clientHeight + params.scrollTop + threshold
    if ((height >= document.body.scrollHeight) && loading === 'ready') {
      setLoading('fetch')
      fetcher(list.length)
        .then((data) => {
          setList([...list, ...data])
          setTimeout(() => {
            setLoading('ready')
          }, 600)
        })
    }
  }

  return [list, setList, loading === 'fetch', setLoading, onScroll]
}

const columns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    flexGrow: 1
  },
  {
    key: 'time',
    label: 'Time',
    width: 100,
    flexGrow: 2
  },
  {
    key: 'proposer',
    label: 'Proposer',
    width: 100,
    flexGrow: 2
  },
  {
    key: 'num_txs',
    label: "# of Txs",
    width: 100,
    flexGrow: 1
  }
]

const Blocks = () => {
  const {height: blockHeight, chainId, updated} = useSelector<RootState, BlockchainInitialState>(state => state.blockchain)
  const [maxHeight, setMaxHeight] = useState(1)

  const [blocks, setBlocks, open, setLoading, onScroll] = useScrollUpdate<BlockState>(async (size) => {
    const nextHeight = maxHeight - size

    if (nextHeight <= 0) {
      setLoading('done')
      return []
    }

    const {data} = await Api.FetchBlocks(chainId, maxHeight - size)
    return data
  })

  useEffect(() => {
    if (updated) {
      setMaxHeight(blockHeight)
      Api
        .FetchBlocks(chainId, blockHeight)
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
      <Grid
        item
        lg={12}
        md={12}
        sm={12}
        xs={12}
      >
        <InfinityTable<BlockState>
          onScroll={onScroll}
          columns={columns}
          rowKey={'hash'}
          data={blocks}
        />
      </Grid>
      <Snackbar
        open={open}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        autoHideDuration={2000}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          Loading complete
        </MuiAlert>
      </Snackbar>
    </>
  )
}

export default Blocks
