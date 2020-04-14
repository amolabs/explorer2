import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import InformationCard from "../../component/InformationCard"
import {initialTransactions, TransactionSchema} from "../../reducer/blockchain"
import ExplorerAPI from "../../ExplorerAPI"
import {useUpdateState} from "../../reducer"
import {ActualAMO, AMO} from "../../util"
import {Grid, Link as UrlLink} from "@material-ui/core"

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
  ],
  issue: [
    {
      key: 'udc',
      header: 'UDC'
    },
    {
      key: 'desc',
      header: 'Description'
    },
    {
      key: 'amount',
      header: 'Amount',
      format: (amount: string) => {
        return Number(amount).toLocaleString()
      }
    }
  ],
  delegate: [
    {
      key: 'to',
      header: 'Validator'
    },
    {
      key: 'amount',
      header: 'Amount',
      format: (amount: string) => {
        return AMO(Number(amount))
      }
    }
  ],
  setup: [
    {
      key: 'storage',
      header: 'Storage'
    },
    {
      key: 'url',
      header: 'URL',
      format: (url: string) => {
        return (
          <UrlLink href={url}>
            {url}
          </UrlLink>
        )
      }
    },
    {
      key: 'registration_fee',
      header: 'Registration fee'
    },
    {
      key: 'hosting_fee',
      header: 'Hosting fee'
    }
  ]
}

const columns = [
  {
    key: 'hash',
    header: 'Hash'
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
    key: 'fee',
    header: 'Fee',
    format: (fee: number) => {
      return AMO(fee)
    }
  },
  {
    key: 'tx_bytes',
    header: 'Tx bytes'
  },
]

const payloadSpecificColumns = [
  {
    key: 'type',
    header: 'Type'
  },
  {
    key: 'info',
    header: 'Result'
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
          columns={[
            ...payloadSpecificColumns,
            ...payloadColumns[tx.type]
          ]}
          data={{
            type: tx.type,
            info: tx.info,
            ...JSON.parse(tx.payload)
          }}
        />
      </Grid>
    </Grid>
  )
}

export default Transaction
