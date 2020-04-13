import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {RootState, useUpdateState} from "../reducer"
import {BlockchainState, TransactionSchema} from "../reducer/blockchain"
import StatCard from "../component/StatCard"
import {Equalizer, HighlightOff, Speed, Timelapse} from "@material-ui/icons"
import InfinityTable, {useScrollUpdate} from "../component/InfinityTable"
import ExplorerAPI from "../ExplorerAPI"
import {Grid, Snackbar} from "@material-ui/core"
import SizeTitle, {LastOptions} from "../component/SizeTitle"
import MuiAlert from "@material-ui/lab/Alert"
import {Link} from "react-router-dom"

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
    key: 'index',
    label: 'Index',
    width: 100,
    flexGrow: 1
  },
  {
    key: 'hash',
    label: 'Hash',
    width: 100,
    flexGrow: 3
  },
  {
    key: 'sender',
    label: 'Sender',
    width: 100,
    flexGrow: 2
  },
  {
    key: 'type',
    label: 'Type',
    width: 100,
    flexGrow: 1
  },
]

type TransactionStatsProps = {
  setRef: (instance?: HTMLDivElement) => void
}

const BlockStats = (props: TransactionStatsProps) => {
  const {
    avg_binding_lag,
    num_txs_invalid,
    num_txs
  } = useSelector<RootState, BlockchainState>(state => state.blockchain.blockState)

  return (
    <>
      <StatCard
        title={<SizeTitle target="TX" values={LastOptions} onSizeChange={() => {
        }}/>}
        size="large"
        setRef={props.setRef}
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={Speed}
            title={"Average binding lag"}
            suffix={`blks`}
            color="#FF6E4A"
          >
            {avg_binding_lag.toFixed(2)}
          </StatCard>
          <StatCard
            icon={HighlightOff}
            title={"Invalid Transaction ratio"}
            suffix={`/${num_txs}`}
            color="#9179F2"
          >
            {num_txs_invalid}
          </StatCard>
          <StatCard
            icon={Timelapse}
            title={"Average Tx bytes"}
            suffix={`B`}
            color="#62D96B"
          >
            {0}
          </StatCard>
          <StatCard
            icon={Equalizer}
            title={"Average fee"}
            suffix={`/ tx`}
          >
            {0}
          </StatCard>
        </Grid>
      </StatCard>
    </>
  )
}

const Transactions = () => {
  const [ref, setRef] = useState<HTMLDivElement | undefined>(undefined)

  const {chainId, updated} = useUpdateState()
  const height = useSelector<RootState, number>(state => state.blockchain.height)

  const [list, setList, loading, setLoading, onScroll] = useScrollUpdate<TransactionSchema>(async (size: number) => {
    const {data} = await ExplorerAPI
      .fetchTransactions(chainId, height, size)

    if (data.length === 0) {
      setLoading('done')
    }

    return data
  }, 200 + (ref ? ref.clientHeight : 0))

  useEffect(() => {
    if (updated) {
      ExplorerAPI
        .fetchTransactions(chainId, height, 0)
        .then(({data}) => {
          setList(data)
          window.scrollTo({
            top: 0
          })
        })
    }
  }, [updated])

  return (
    <>
      <BlockStats setRef={setRef}/>
      <InfinityTable
        onScroll={onScroll}
        columns={columns}
        rowKey="hash"
        data={list}
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

export default Transactions
