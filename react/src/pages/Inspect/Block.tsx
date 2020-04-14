import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {BlockState, initialBlock} from "../../reducer/blocks"
import {useUpdateState} from "../../reducer"
import ExplorerAPI from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import CollapseTable from "../../component/CollapseTable"
import {TransactionSchema} from "../../reducer/blockchain"
import moment from 'moment'

const columns = [
  {
    key: 'height',
    header: 'Height'
  },
  {
    key: 'hash',
    header: 'Hash'
  },
  {
    key: 'proposer',
    header: 'Proposer'
  },
  {
    key: 'time',
    header: 'Time',
    format: (time: string) => {
      return `${moment(time).fromNow()} (${time})`
    }
  },
  {
    key: 'num_txs',
    header: '# of txs'
  }
]

const transactionColumns = [
  {
    key: 'height',
    header: 'Height'
  },
  {
    key: 'index',
    header: 'Index'
  },
  {
    key: 'hash',
    header: 'Hash'
  },
  {
    key: 'sender',
    header: 'Sender'
  },
  {
    key: 'type',
    header: 'Type'
  },
  {
    key: 'info',
    header: 'Result'
  }
]

const Block = () => {
  const [block, setBlock] = useState<BlockState>(initialBlock)
  const [transactions, setTransactions] = useState<TransactionSchema[]>([])
  const {chainId} = useUpdateState()

  const {height} = useParams()

  useEffect(() => {
    if (height) {
      const blockHeight = parseInt(height)
      ExplorerAPI
        .fetchBlock(chainId, blockHeight)
        .then(({data}) => {
          setBlock(data)
        })
      ExplorerAPI
        .fetchBlockTransaction(chainId, blockHeight, 0)
        .then(({data}) => {
          setTransactions(data)
        })
    }
  }, [chainId, height])

  return (
    <>
      <InformationCard
        title="Block information"
        columns={columns}
        data={block}
      />
      <CollapseTable
        dataSource={transactions}
        columns={transactionColumns}
        rowKey='hash'
      />
    </>
  )
}

export default Block
