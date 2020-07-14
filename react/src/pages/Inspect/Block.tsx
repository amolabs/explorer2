import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {BlockState, initialBlock} from "../../reducer/blocks"
import {useChainId} from "../../reducer"
import ExplorerAPI from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import CollapseTable from "../../component/CollapseTable"
import {TransactionSchema} from "../../reducer/blockchain"
import moment from 'moment'
import {displayResult} from "../../util"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"

const columns = [
  {
    key: 'height',
    header: 'Height'
  },
  {
    key: 'hash',
    header: 'Hash',
  },
  {
    key: 'proposer',
    header: 'Proposer',
    format: (validator: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/validator/${validator}`}>
          {validator}
        </Link>
      )
    }
  },
  {
    key: 'time',
    header: 'Time',
    format: (time: string, chainId: string, data: BlockState) => {
      return `${moment(time).fromNow()} (${moment(time).format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}) (+${data.interval.toFixed(3)} sec)`
    }
  },
  {
    key: 'num_txs',
    header: '# of txs'
  }
]

const transactionColumns = [
  {
    key: 'index',
    header: 'Index',
    format: (index: number) => {
      return index + 1
    }
  },
  {
    key: 'hash',
    header: 'Hash',
    format: (hash: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/tx/${hash}`}>
          {hash}
        </Link>
      )
    }
  },
  {
    key: 'sender',
    header: 'Sender',
    format: (sender: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/account/${sender}`}>
          {sender}
        </Link>
      )
    }
  },
  {
    key: 'type',
    header: 'Type'
  },
  {
    key: 'info',
    header: 'Result',
    format: displayResult
  }
]

const PAGE_SIZE = 14

const Block = () => {
  const {height} = useParams()

  const [block, setBlock] = useState<BlockState>(initialBlock)
  const [transactions, setTransactions] = useState<TransactionSchema[]>([])
  const chainId = useChainId()

  const [blockLoading, setBlockLoading] = useState(true)
  const [txLoading, setTxLoading] = useState(true)
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    if (height) {
      const blockHeight = parseInt(height)
      ExplorerAPI
        .fetchBlock(chainId, blockHeight)
        .then(({data}) => {
          setBlock(data)
          setBlockLoading(false)
          if (data.num_txs !== 0) {
            ExplorerAPI
              .fetchBlockTransaction(chainId, blockHeight, 0, PAGE_SIZE)
              .then(({data}) => {
                setTransactions(data)
                setTxLoading(false)
              })
          } else {
            setTransactions([])
            setTxLoading(false)
          }
        })
        .catch(() => {
          dispatch(replace(`/${chainId}/inspect/404`, {type: 'BLOCK', search: height}))
          setBlockLoading(false)
        })
    }
  }, [chainId, height, dispatch])

  const onChangePage = (e: any, page: number) => {
    if (height && !txLoading) {
      const blockHeight = parseInt(height)
      setTxLoading(true)
      ExplorerAPI
        .fetchBlockTransaction(chainId, blockHeight, page * PAGE_SIZE, PAGE_SIZE)
        .then(({data}) => {
          setTransactions(data)
          setTxLoading(false)
          setPage(page)
        })
    }
  }

  const pagination = {
    onChangePage,
    page,
    count: block.num_txs,
    rowsPerPage: PAGE_SIZE
  }

  return (
    <>
      <InformationCard
        title="Block information"
        columns={columns}
        data={block}
        divider
        loading={blockLoading}
      />
      <CollapseTable
        dataSource={transactions}
        columns={transactionColumns}
        rowKey='hash'
        fallbackText="There is no transaction in block"
        loading={txLoading}
        pagination={pagination}
      />
    </>
  )
}

export default Block
