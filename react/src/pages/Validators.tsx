import React, {useEffect, useState} from 'react'
import StatCard from "../component/StatCard"
import {Grid} from "@material-ui/core"
import ExplorerAPI, {AccountSchema, ValidatorStat} from "../ExplorerAPI"
import {AccountBalance, AllInclusive, CompareArrows} from "@material-ui/icons"
import CollapseTable from "../component/CollapseTable"
import {useUpdateState} from "../reducer"
import {AMO} from "../util"
import {Link} from "react-router-dom"

const columns = [
  {
    key: 'val_addr',
    header: 'Address',
    format: (validator: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/validator/${validator}`}>
          {validator}
        </Link>
      )
    }
  },
  {
    key: 'stake',
    header: 'Stake',
    format: (stake: string) => {
      return AMO(Number(stake))
    }
  },
  {
    key: 'val_power',
    header: 'Power',
    format: (power: string) => {
      return Number(power).toPrecision(5)
    }
  },
]

const Validators = () => {
  const {chainId} = useUpdateState()
  const [stat, setStat] = useState<ValidatorStat>({
    num: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ExplorerAPI
      .fetchValidatorStat(chainId)
      .then(({data}) => {
        setStat(data)
      })
  }, [chainId])

  const [validators, setValidators] = useState<AccountSchema[]>([])

  useEffect(() => {
    ExplorerAPI
      .fetchValidators(chainId, 0)
      .then(({data}) => {
        setValidators(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [stat, chainId])

  return (
    <>
      <StatCard
        title="Validator Stat"
        size="large"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={AccountBalance}
            title={"# of validators"}
            color="#FF6E4A"
          >
            {stat.num}
          </StatCard>
          <StatCard
            icon={AllInclusive}
            title={"Average activity"}
            suffix={`%`}
            color="#62D96B"
          >
            -
          </StatCard>
          <StatCard
            icon={CompareArrows}
            title={"Total effective stakes"}
            color="#9179F2"
          >
            -
          </StatCard>
          <StatCard
            icon={CompareArrows}
            title={"Average effective stake"}
            suffix={`/ validators`}
          >
            -
          </StatCard>
        </Grid>
      </StatCard>
      <CollapseTable
        dataSource={validators}
        columns={columns}
        rowKey="address"
        fallbackText="No validators"
        loading={loading}
      />
    </>
  )
}

export default Validators
