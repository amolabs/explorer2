import React, {useEffect, useState} from 'react'
import InformationCard from "../../component/InformationCard"
import ExplorerAPI, {AccountSchema} from "../../ExplorerAPI"
import {Link, useParams} from 'react-router-dom'
import {RootState, useUpdateState} from "../../reducer"
import {AMO} from "../../util"
import {useSelector} from "react-redux"
import CollapseTable from "../../component/CollapseTable"
import {TransactionSchema} from "../../reducer/blockchain"

const columns = [
  {
    key: 'address',
    header: 'Address'
  },
  {
    key: 'balance',
    header: 'Balance',
    format: (balance: string) => {
      return `${Number(balance).toLocaleString()} mote (${AMO(Number(balance))})`
    }
  },
  {
    key: 'stake',
    header: 'Stake',
    format: (stake: string) => {
      return `${Number(stake).toLocaleString()} mote (${AMO(Number(stake))})`
    }
  },
  {
    key: 'delegate',
    header: 'Delegate'
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
    header: 'Result'
  }
]

const Account = () => {
  const {address} = useParams()
  const {chainId, updated} = useUpdateState()

  const height = useSelector<RootState, number>(state => state.blockchain.height)

  const [account, setAccount] = useState<AccountSchema>({
    address: '',
    balance: '',
    chain_id: '',
    del_addr: '',
    delegate: '',
    stake: '',
    val_addr: '',
    val_power: '',
    val_pubkey: ''
  })
  const [transactions, setTransactions] = useState<TransactionSchema[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ExplorerAPI
      .fetchAccount(chainId, address as string)
      .then(({data}) => {
        setAccount(data)
      })
  }, [chainId])

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
  }, [chainId, updated])

  return (
    <>
      <InformationCard
        title="Account information"
        columns={columns}
        data={account}
        divider
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
