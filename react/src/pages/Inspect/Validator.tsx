import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useUpdateState} from "../../reducer"
import ExplorerAPI, {DelegateItem, ValidatorAccount} from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import {AMO, displayAddress} from "../../util"
import CollapseTable from "../../component/CollapseTable"

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
    format: AMO
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
    key: 'delegate',
    header: 'Delegate',
    format: AMO
  }
]

const Validator = () => {
  const {address} = useParams()
  const {chainId, updated} = useUpdateState()
  const [validator, setValidator] = useState<ValidatorAccount>({
    address: '',
    owner: '',
    power: '0',
    pubkey: '',
    stake: '0',
    eff_stake: '0'
  })
  const [delegators, setDelegators] = useState<DelegateItem[]>([])
  const [loading, setLoading] = useState(true)
  const [delegatorsLoading, setDelegatorsLoading] = useState(true)

  useEffect(() => {
    if (updated) {
      ExplorerAPI
        .fetchValidatorAccount(chainId, address as string)
        .then(({data}) => {
          setValidator(data)
          setLoading(false)
        })
      ExplorerAPI
        .fetchDelegators(chainId, address as string, 0)
        .then(({data}) => {
          setDelegators(data)
          setDelegatorsLoading(false)
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
        dataSource={delegators}
        columns={delegatorColumns}
        rowKey="address"
        fallbackText="No delegators"
        loading={delegatorsLoading}
      />
    </>
  )
}

export default Validator
