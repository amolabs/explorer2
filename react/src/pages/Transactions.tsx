import React, {useEffect, useState} from 'react'
import {useFixedHeight, useUpdateState} from "../reducer"
import {TransactionSchema} from "../reducer/blockchain"
import StatCard from "../component/StatCard"
import {Equalizer, HighlightOff, Speed, Timelapse} from "@material-ui/icons"
import InfinityTable, {useScrollUpdate} from "../component/InfinityTable"
import ExplorerAPI from "../ExplorerAPI"
import {Grid} from "@material-ui/core"
import SizeTitle, {LastOptions} from "../component/SizeTitle"
import {transactionColumns} from "../component/columns"

type TransactionStatsProps = {
  setRef: (instance?: HTMLDivElement) => void
}

const BlockStats = (props: TransactionStatsProps) => {
  const [txStat, setTxStat] = useState<TxStat>({
    chain_id: 'amo-cherrryblossom-01',
    avg_binding_lag: 0,
    avg_fee: 0,
    avg_tx_bytes: 0,
    max_binding_lag: 0,
    num_txs: 0,
    num_txs_invalid: 0,
    num_txs_valid: 0,
    tx_height: 1
  })
  const {chainId} = useUpdateState()

  const onSizeChange = (txs: number) => {
    ExplorerAPI
      .fetchTxStat(chainId, txs)
      .then(({data}) => {
        setTxStat(data)
      })
  }

  useEffect(() => {
    onSizeChange(100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  return (
    <>
      <StatCard
        title={<SizeTitle target="Tx" values={LastOptions} onSizeChange={onSizeChange}/>}
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
            {txStat.avg_binding_lag.toFixed(2)}
          </StatCard>
          <StatCard
            icon={HighlightOff}
            title={"Invalid Transaction ratio"}
            suffix={`/ ${txStat.num_txs}`}
            color="#9179F2"
          >
            {txStat.num_txs_invalid}
          </StatCard>
          <StatCard
            icon={Timelapse}
            title={"Average Tx bytes"}
            suffix={`B`}
            color="#62D96B"
          >
            {txStat.avg_tx_bytes}
          </StatCard>
          <StatCard
            icon={Equalizer}
            title={"Average fee"}
            suffix={`/ tx`}
          >
            {txStat.avg_fee.toFixed(2)}
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
        columns={transactionColumns}
        rowKey="hash"
        data={list}
        loading={loading}
      />
    </>
  )
}

export default Transactions
