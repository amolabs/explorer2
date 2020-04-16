import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {RootState, useFixedHeight} from "../reducer"
import {BlockchainState, TransactionSchema} from "../reducer/blockchain"
import StatCard from "../component/StatCard"
import {Equalizer, HighlightOff, Speed, Timelapse} from "@material-ui/icons"
import InfinityTable, {useScrollUpdate} from "../component/InfinityTable"
import ExplorerAPI from "../ExplorerAPI"
import {Grid} from "@material-ui/core"
import SizeTitle, {LastOptions} from "../component/SizeTitle"
import {Link} from "react-router-dom"
import {displayAddress, displayResult} from "../util"

const columns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    flexGrow: 1,
    columnData: {
      format: (height: number, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/block/${height}`}>
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
    flexGrow: 10,
    columnData: {
      format: (hash: string, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/tx/${hash}`}>
            {hash}
          </Link>
        )
      }
    }
  },
  {
    key: 'sender',
    label: 'Sender',
    width: 100,
    flexGrow: 5,
    columnData: {
      format: displayAddress
    }
  },
  {
    key: 'type',
    label: 'Type',
    width: 100,
    flexGrow: 1
  },
  {
    key: 'info',
    label: 'Result',
    width: 100,
    flexGrow: 2,
    columnData: {
      format: displayResult
    }
  }
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
        title={<SizeTitle target="Tx" values={LastOptions} onSizeChange={() => {
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
            suffix={`/ ${num_txs}`}
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

  const {chainId, fixedHeight} = useFixedHeight()

  const [list, setList, loading, setLoading, onScroll] = useScrollUpdate<TransactionSchema>(async (size: number) => {
    const {data} = await ExplorerAPI.fetchTransactions(chainId, fixedHeight, size)

    if (data.length === 0) {
      setLoading('done')
    }

    return data
  }, 200 + (ref ? ref.clientHeight : 0))

  useEffect(() => {
    if (fixedHeight !== -1) {
      ExplorerAPI
        .fetchTransactions(chainId, fixedHeight, 0)
        .then(({data}) => {
          setList(data)
          window.scrollTo({
            top: 0
          })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedHeight])

  return (
    <>
      <BlockStats setRef={setRef}/>
      <InfinityTable
        onScroll={onScroll}
        columns={columns}
        rowKey="hash"
        data={list}
        loading={loading}
      />
    </>
  )
}

export default Transactions
