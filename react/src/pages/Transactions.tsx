import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {RootState, useUpdateState} from "../reducer"
import {BlockchainState, TransactionSchema} from "../reducer/blockchain"
import StatCard from "../component/StatCard"
import {Equalizer} from "@material-ui/icons"
import InfinityTable, {useScrollUpdate} from "../component/InfinityTable"
import ExplorerAPI from "../ExplorerAPI"

const columns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    flexGrow: 1
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
        icon={<Equalizer/>}
        title={"Average binding lag"}
        suffix={`blks`}
        setRef={props.setRef}
      >
        {avg_binding_lag.toFixed(2)}
      </StatCard>
      <StatCard
        icon={<Equalizer/>}
        title={"Invalid Transaction ratio"}
        suffix={`/${num_txs}`}
      >
        {num_txs_invalid}
      </StatCard>
      <StatCard
        icon={<Equalizer/>}
        title={"Average Tx bytes"}
        suffix={`B`}>
        {0}
      </StatCard>
      <StatCard
        icon={<Equalizer/>}
        title={"Average fee"}
        suffix={`/ tx`}
      >
        {0}
      </StatCard>
    </>
  )
}

const Transactions = () => {
  const [ref, setRef] = useState<HTMLDivElement | undefined>(undefined)

  const {chainId, updated} = useUpdateState()
  const totalTransactionSize = useSelector<RootState, number>(state => state.blockchain.blockState.num_txs)

  const [list, setList, loading, setLoading, onScroll] = useScrollUpdate<TransactionSchema>(async (size: number) => {
    const {data} = await ExplorerAPI
      .fetchTransactions(chainId, totalTransactionSize, size)

    return data
  }, 200 + (ref ? ref.clientHeight : 0))

  useEffect(() => {
    if (updated) {
      ExplorerAPI
        .fetchTransactions(chainId, totalTransactionSize, 0)
        .then(({data}) => {
          setList(data)
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
    </>
  )
}

export default Transactions
