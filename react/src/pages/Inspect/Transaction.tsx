import React, {useEffect, useMemo, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import InformationCard from "../../component/InformationCard"
import {initialTransactions, TransactionSchema} from "../../reducer/blockchain"
import ExplorerAPI from "../../ExplorerAPI"
import {useUpdateState} from "../../reducer"
import {AMO, displayAddress, displayAmount, displayResult} from "../../util"
import {Grid, Link as UrlLink} from "@material-ui/core"

const payloadColumns: StringMap = {
  transfer: [
    {
      key: 'to',
      header: 'To',
      format: displayAddress
    },
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
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
      format: displayAmount
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
      format: displayAmount
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
      format: displayAmount
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
  ],
  propose: [],
  retract: [
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  close: [
    {
      key: 'storage',
      header: 'Storage'
    }
  ],
  lock: [
    {
      key: 'udc',
      header: 'UDC'
    },
    {
      key: 'holder',
      header: 'Holder',
      format: displayAddress
    },
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
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
    format: AMO
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
    header: 'Result',
    format: displayResult
  }
]

const Transaction = () => {
  const {hash} = useParams()
  const [tx, setTx] = useState<TransactionSchema>({
    hash,
    ...initialTransactions
  })
  const [loading, setLoading] = useState(true)

  const {chainId, updated} = useUpdateState()

  useEffect(() => {
    if (updated && tx.sender === "") {
      ExplorerAPI
        .fetchTransaction(chainId, hash as string)
        .then(({data}) => {
          setTx(data[0])
          setLoading(false)
        })
    }
  }, [chainId, hash, updated, tx.sender])

  const payload = useMemo(() => {
    return {
      type: tx.type,
      info: tx.info,
      ...JSON.parse(tx.payload)
    }
  }, [tx])

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
          loading={loading}
        />
        <InformationCard
          columns={[
            ...payloadSpecificColumns,
            ...payloadColumns[tx.type]
          ]}
          data={payload}
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}

export default Transaction
