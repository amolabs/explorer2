import React, {useEffect, useState} from 'react'
import InformationCard from "../../component/InformationCard"
import ExplorerAPI, {AccountSchema} from "../../ExplorerAPI"
import {Link, useParams} from 'react-router-dom'
import {RootState, useUpdateState} from "../../reducer"
import {displayAmount, displayResult} from "../../util"
import {useSelector} from "react-redux"
import CollapseTable from "../../component/CollapseTable"
import {TransactionSchema} from "../../reducer/blockchain"
import {AxiosError} from "axios"

const columns = [
  {
    key: 'address',
    header: 'Address'
  },
  {
    key: 'balance',
    header: 'Balance',
    format: displayAmount
  },
  {
    key: 'stake',
    header: 'Stake',
    format: displayAmount
  },
  {
    key: 'delegate',
    header: 'Delegate',
    format: displayAmount
  }
]

const transactionColumns = [
  {
    key: 'height',
    header: 'Height',
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'index',
    header: 'Index'
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

const Account = () => {
  const {address} = useParams()
  const {chainId, updated} = useUpdateState()

  const height = useSelector<RootState, number>(state => state.blockchain.height)

  const [account, setAccount] = useState<AccountSchema>({
    address: address as string,
    balance: '0',
    chain_id: '',
    del_addr: '',
    delegate: '0',
    stake: '0',
    val_addr: '',
    val_power: '0',
    val_pubkey: ''
  })
  const [transactions, setTransactions] = useState<TransactionSchema[]>([])
  const [statLoading, setStatLoading] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ExplorerAPI
      .fetchAccount(chainId, address as string)
      .then(({data}) => {
        setAccount(data)
        setStatLoading(false)
      })
      .catch((e: AxiosError) => {
        setStatLoading(false)
      })
  }, [chainId, address])

  useEffect(() => {
    if (updated) {
      ExplorerAPI
        .fetchAccountTransactions(chainId, address as string, height, 0)
        .then(({data}) => {
          setTransactions(data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [chainId, updated, address, height])

  return (
    <>
      <InformationCard
        title="Account information"
        columns={columns}
        data={account}
        divider
        loading={statLoading}
      />
      <CollapseTable
        dataSource={transactions}
        columns={transactionColumns}
        rowKey="hash"
        fallbackText="No related transactions"
        loading={loading}
      />
    </>
  )
}

export default Account
