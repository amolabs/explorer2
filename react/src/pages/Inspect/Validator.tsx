import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useUpdateState} from "../../reducer"
import ExplorerAPI, {ValidatorAccount} from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import {AMO} from "../../util"

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

const Validator = () => {
  const {address} = useParams()
  const {chainId} = useUpdateState()
  const [validator, setValidator] = useState<ValidatorAccount>({
    address: '',
    delegators: [],
    owner: '',
    power: '0',
    pubkey: '',
    stake: '0'
  })
  useEffect(() => {
    ExplorerAPI
      .fetchValidatorAccount(chainId, address as string)
      .then(({data}) => {
        setValidator(data)
      })

  }, [chainId])

  return (
    <>
      <InformationCard
        columns={columns}
        data={validator}
        title="Validator information"
      />
    </>
  )
}

export default Validator
