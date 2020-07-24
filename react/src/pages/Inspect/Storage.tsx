import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useUpdateState} from "../../reducer"
import ExplorerAPI, {DelegateItem} from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import {AMO, displayAddress, displayMono} from "../../util"
//import CollapseTable from "../../component/CollapseTable"

const columns = [
  {
    key: 'storage_id',
    header: 'ID',
    format: (storage_id: string, chainId: string) => {
      return (
        <code>{storage_id}</code>
      )
    }
  },
  {
    key: 'owner',
    header: 'Owner',
    format: (owner: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/account/${owner}`}>
          <code>{owner}</code>
        </Link>
      )
    }
  },
  {
    key: 'registration_fee',
    header: 'Registration fee',
    format: (registration_fee: string, chainId: string) => {
      return AMO(registration_fee)
    }
  },
  {
    key: 'hosting_fee',
    header: 'Hosting fee',
    format: (hosting_fee: string, chainId: string) => {
      return AMO(hosting_fee)
    }
  },
  {
    key: 'active',
    header: 'Status',
    format: (active: boolean, chainId: string) => {
      return active ? 'active' : 'inactive'
    }
  },
]

const Storage = () => {
  const {storage_id} = useParams()
  const {chainId, updated} = useUpdateState()
  const [storage, setStorage] = useState<StorageInfo>({
    chain_id: '',
    storage_id: 0,
    url: '',
    registration_fee: '',
    hosting_fee: '',
    owner: '',
    active: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ExplorerAPI
      .fetchStorage(chainId, storage_id as number)
      .then(({data}) => {
        setStorage(data)
        setLoading(false)
      })
  }, [chainId, storage_id, updated])

  return (
    <>
      <InformationCard
        columns={columns}
        data={storage}
        title="Storage information"
        loading={loading}
        divider
      />
    </>
  )
}

export default Storage
