import React, {useEffect, useState} from 'react'
import InformationCard from "../../component/InformationCard"
import ExplorerAPI from "../../ExplorerAPI"
import {Link, useParams} from 'react-router-dom'
import {RootState, useFixedHeight, useUpdateState} from "../../reducer"
import {displayAddress, displayAmount, displayResult} from "../../util"
import {useSelector} from "react-redux"
import CollapseTable from "../../component/CollapseTable"
import {TransactionSchema} from "../../reducer/blockchain"
import {AxiosError} from "axios"
import InfinityTable, {useScrollUpdate} from "../../component/InfinityTable"
import {transactionColumns} from "../../component/columns"

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

const Account = () => {
  const {address} = useParams()
  const {chainId, fixedHeight} = useFixedHeight()

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
  const [statLoading, setStatLoading] = useState(true)
  const [ref, setRef] = useState<HTMLDivElement | undefined>(undefined)

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

  const [list, setList, loading, setLoading, onScroll] = useScrollUpdate<TransactionSchema>(async (size: number) => {
    const {data} = await ExplorerAPI.fetchAccountTransactions(chainId, address as string, fixedHeight, size)

    if (data.length === 0) {
      setLoading('done')
    }

    return data
  }, 200 + (ref ? ref.clientHeight : 0))

  useEffect(() => {
    if (fixedHeight !== -1) {
      ExplorerAPI.fetchAccountTransactions(chainId, address as string, fixedHeight, 0)
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
      <InformationCard
        setRef={setRef}
        title="Account information"
        columns={columns}
        data={account}
        divider
        loading={statLoading}
      />
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

export default Account
