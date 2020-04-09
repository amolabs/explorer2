import React, {useEffect, useState} from 'react'
import CollapseTable from "../component/CollapseTable"
import {useSelector} from "react-redux"
import {RootState} from "../reducer"
import {BlockchainState, TransactionSchema} from "../reducer/blockchain"
import Axios from "axios"
import StatCard from "../component/StatCard"
import {Equalizer} from "@material-ui/icons"

type PageContext = {
  chainId: string,
  totalTxn: number
}

const columns = [
  {
    key: 'height'
  },
  {
    key: 'index'
  },
  {
    key: 'hash'
  },
  {
    key: 'sender'
  },
  {
    key: 'type'
  },
]

const RecentTransaction = () => {

  const context = useSelector<RootState, PageContext>(state => ({
    chainId: state.blockchain.blockState.chain_id,
    totalTxn: state.blockchain.blockState.num_txs_valid
  }))

  const [page, setPage] = useState(0)
  const [tx, setTx] = useState<TransactionSchema[]>([])

  useEffect(() => {
    Axios
      .get(`http://explorer.amolabs.io/api/chain/${context.chainId}/txs?top=${context.totalTxn}&from=${page * 20}&num=20`)
      .then(({data}) => {
        setTx(data)
      })
  }, [page])

  return (
    <CollapseTable<TransactionSchema>
      dataSource={tx}
      columns={columns}
      rowKey="hash"
      maxHeight="680px"
      pagination={{
        count: context.totalTxn,
        rowsPerPage: 20,
        page,
        onChangePage: (event, newPage) => {
          setPage(newPage)
        },
      }}
    />
  )
}

const BlockStats = () => {
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

  return (
    <>
      <BlockStats/>
      <RecentTransaction/>
    </>
  )
}

export default Transactions
