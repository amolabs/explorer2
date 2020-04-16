import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useUpdateState} from "../../reducer"
import ExplorerAPI, {ValidatorAccount} from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import {AMO, displayAddress} from "../../util"
import CollapseTable from "../../component/CollapseTable"
import StatCard from "../../component/StatCard"

const columns = [
  {
    key: 'address',
    header: 'Address'
  },
  {
    key: 'pubkey',
    header: 'Public key'
  },
  {
    key: 'owner',
    header: 'Control account',
    format: (sender: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/account/${sender}`}>
          {sender}
        </Link>
      )
    }
  },
  {
    key: 'stake',
    header: 'Effective stake',
    format: (stake: string) => {
      return AMO(Number(stake))
    }
  },
  {
    key: 'power',
    header: 'Voting power'
  }
]

const delegatorColumns = [
  {
    key: 'address',
    header: 'Address',
    format: displayAddress
  },
  {
    key: 'amount',
    header: 'Amount',
    format: AMO
  }
]

const Validator = () => {
  const {address} = useParams()
  const {chainId, updated} = useUpdateState()
  const [validator, setValidator] = useState<ValidatorAccount>({
    address: '',
    delegators: [],
    owner: '',
    power: '0',
    pubkey: '',
    stake: '0'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (updated) {
      ExplorerAPI
        .fetchValidatorAccount(chainId, address as string)
        .then(({data}) => {
          setValidator(data)
          setLoading(false)
        })
    }
  }, [chainId, address, updated])

  return (
    <>
      <InformationCard
        columns={columns}
        data={validator}
        title="Validator information"
        loading={loading}
        divider
      />
      <CollapseTable
        dataSource={validator.delegators}
        columns={delegatorColumns}
        rowKey="address"
        fallbackText="No delegators"
        loading={loading}
      />
    </>
  )
}

export default Validator
