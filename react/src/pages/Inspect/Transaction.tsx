import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import InformationCard from "../../component/InformationCard"
import {initialTransactions, TransactionSchema} from "../../reducer/blockchain"
import ExplorerAPI from "../../ExplorerAPI"
import {useUpdateState} from "../../reducer"
import {ActualAMO, AMO} from "../../util"
import {Grid} from "@material-ui/core"

type RegisterTx = {
  target: string,
  custody: string
}

const payloadColumns: StringMap = {
  transfer: [
    {
      key: 'to',
      header: 'To'
    },
    {
      key: 'amount',
      header: 'Amount',
      format: (amount: string) => {
        return `${Number(amount).toLocaleString()} mote (${ActualAMO(Number(amount))})`
      }
    }
  ],
  register: [
    {
      key: 'target',
      header: 'Target'
    },
    {
      key: 'custody',
      header: 'Custody'
    }
  ],
  stake: [
    {
      key: 'validator',
      header: 'Validator'
    },
    {
      key: 'amount',
      header: 'Amount',
      format: (amount: string) => {
        return `${Number(amount).toLocaleString()} mote (${ActualAMO(Number(amount))})`
      }
    }
  ]
}

const columns = [
  {
    key: 'hash',
    header: 'Hash'
  },
  {
    key: 'type',
    header: 'Type'
  },
  {
    key: 'info',
    header: 'Result'
  },
  {
    key: 'sender',
    header: 'Sender'
  },
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
    key: 'fee',
    header: 'Fee',
    format: (fee: number) => {
      return AMO(fee)
    }
  },
  {
    key: 'tx_bytes',
    header: 'Tx bytes'
  }
]

const Transaction = () => {
  const {hash} = useParams()
  const [tx, setTx] = useState<TransactionSchema>({
    hash,
    ...initialTransactions
  })

  const {chainId} = useUpdateState()

  useEffect(() => {
    ExplorerAPI
      .fetchTransaction(chainId, hash as string)
      .then(({data}) => {
        setTx(data[0])
      })
  }, [chainId, hash, setTx])

  return (
    <Grid
      item
      xs={12}
    >
      <Grid
        container
        spacing={0}
      >
        <InformationCard
          title="Tx information"
          columns={columns}
          data={tx}
          divider
        />
        <InformationCard
          columns={payloadColumns[tx.type]}
          data={JSON.parse(tx.payload)}
        />
      </Grid>
    </Grid>
  )
}

export default Transaction
